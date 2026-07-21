import { get, set } from "idb-keyval";

const SYNC_KEY = "syncQueue";
const API_SYNC = "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/report";
const TECH_REPORTS_KEY = "technicalReports";

const syncItemKey = (item) => `${item?.type || "report"}:${String(item?.reportId ?? item?.localId ?? item?.id ?? "")}`;

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

// aggiunge un elemento alla coda
export const addToSyncQueue = async (item) => {
    const queue = (await get(SYNC_KEY)) || [];
    const nextItem = {
        ...item,
        type: item.type || "report",
        reportId: item.reportId ?? item.localId ?? item.id,
        localId: item.localId ?? item.reportId ?? item.id,
    };
    const filtered = queue.filter((existing) => syncItemKey(existing) !== syncItemKey(nextItem));
    filtered.push(nextItem);
    await set(SYNC_KEY, filtered);
};

const postSyncItem = async (item) => {
    const res = await fetch(API_SYNC, {
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

    const queue = (await get(SYNC_KEY)) || [];
    if (!queue.length) return;

    const remaining = [];

    for (const item of queue) {
        try {
            const result = await postSyncItem(item);
            const returnedReportId = result.reportId ?? item.reportId;
            const localId = result.localId ?? item.localId ?? item.reportId;

            updateLocalTechnicalReportId(localId, returnedReportId, result.lastModified);
        } catch (err) {
            console.error("Sync fallita, riproverò", err);
            remaining.push(item);
        }
    }

    await set(SYNC_KEY, remaining);
};
