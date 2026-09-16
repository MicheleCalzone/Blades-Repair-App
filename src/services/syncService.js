import { get, set } from "idb-keyval";

const SYNC_KEY = "syncQueue";
const API_SYNC = "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/report";
const API_INSPECTION_SYNC = "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/inspection-report";
const TECH_REPORTS_KEY = "technicalReports";
const INSPECTION_REPORTS_KEY = "inspectionReports";

const normalizeQueueType = (item) => {
    if (item?.type === "inspection-report") return "inspection-report";
    return "report";
};

const syncItemKey = (item) => {
    const type = normalizeQueueType(item);
    const reportId = item?.reportId ?? item?.localId ?? item?.id ?? "";
    return `${type}:${String(reportId)}`;
};

const dedupeQueuedItem = (queue, candidate) => {
    const primaryKey = syncItemKey(candidate);
    const sameType = (item) => normalizeQueueType(item) === normalizeQueueType(candidate);
    const sameReport = (item) => String(item?.reportId ?? item?.localId ?? item?.id ?? "") === String(candidate?.reportId ?? candidate?.localId ?? candidate?.id ?? "");

    return queue.filter((existing) => {
        if (existing === candidate) return false;
        if (!sameType(existing)) return true;
        if (!sameReport(existing)) return true;
        return syncItemKey(existing) === primaryKey ? false : true;
    });
};

const updateLocalTechnicalReportId = (oldId, newId, lastModified) => {
    const raw = localStorage.getItem(TECH_REPORTS_KEY);
    if (!raw) return;

    const reports = JSON.parse(raw);
    if (!Array.isArray(reports)) return;

    const updated = reports.map((report) => {
        if (String(report.id) !== String(oldId)) return report;
        return {
            ...report,
            id: newId ?? report.id,
            synced: true,
            lastModified: lastModified || report.lastModified,
        };
    });

    localStorage.setItem(TECH_REPORTS_KEY, JSON.stringify(updated));
};

const updateLocalInspectionReportId = (oldId, newId, lastModified) => {
    const raw = localStorage.getItem(INSPECTION_REPORTS_KEY);
    if (!raw) return;

    const reports = JSON.parse(raw);
    if (!Array.isArray(reports)) return;

    const updated = reports.map((report) => {
        if (String(report.id) !== String(oldId)) return report;
        return {
            ...report,
            id: newId ?? report.id,
            synced: true,
            lastModified: lastModified || report.lastModified,
        };
    });

    localStorage.setItem(INSPECTION_REPORTS_KEY, JSON.stringify(updated));
};

export const clearQueuedSyncItem = async (item) => {
    const queue = (await get(SYNC_KEY)) || [];
    const nextQueue = queue.filter((existing) => syncItemKey(existing) !== syncItemKey(item));
    await set(SYNC_KEY, nextQueue);
};

// aggiunge un elemento alla coda
export const addToSyncQueue = async (item) => {
    const queue = (await get(SYNC_KEY)) || [];
    const nextItem = {
        ...item,
        type: item?.type === "inspection-report" ? "inspection-report" : "report",
        reportId: item.reportId ?? item.localId ?? item.id,
        localId: item.localId ?? item.reportId ?? item.id,
    };

    const filtered = dedupeQueuedItem(queue, nextItem);
    filtered.push(nextItem);
    await set(SYNC_KEY, filtered);
};

const postSyncItem = async (item) => {
    const endpoint = item?.type === "inspection-report" ? API_INSPECTION_SYNC : API_SYNC;
    const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });

    if (!res.ok) throw new Error("Errore sync");

    const result = await res.json();
    if (!result.success) throw new Error(result.message || "Sync rifiutata");

    return result;
};

// prova a sincronizzare
export const syncNow = async () => {
    if (!navigator.onLine) return;

    const queue = ((await get(SYNC_KEY)) || [])
        .filter((item) => item && (item?.type === "report" || item?.type === "inspection-report"))
        .reduce((all, item) => {
            const key = syncItemKey(item);
            const idx = all.findIndex((candidate) => syncItemKey(candidate) === key);
            if (idx >= 0) {
                all[idx] = item;
                return all;
            }
            all.push(item);
            return all;
        }, []);

    if (!queue.length) return;

    const remaining = [];

    for (const item of queue) {
        try {
            if (!item?.type) {
                continue;
            }
            const result = await postSyncItem(item);
            const returnedReportId = result.reportId ?? item.reportId;
            const localId = result.localId ?? item.localId ?? item.reportId;

            if (item?.type === "inspection-report") {
                updateLocalInspectionReportId(localId, returnedReportId, result.lastModified);
            } else {
                updateLocalTechnicalReportId(localId, returnedReportId, result.lastModified);
            }

            await clearQueuedSyncItem(item);
        } catch (err) {
            console.error("Sync fallita, riproverò", err);
            remaining.push(item);
        }
    }

    await set(SYNC_KEY, remaining);
};

if (typeof window !== "undefined") {
    window.addEventListener("online", () => {
        syncNow().catch((err) => {
            console.error("Sync automatica fallita", err);
        });
    });
}
