import { useState, useEffect } from "react";
import { addToSyncQueue, clearQueuedSyncItem } from "../services/syncService";
import { withAuth } from "../services/auth";

const API_BASE = "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1";
const API_INSPECTION_REPORTS = `${API_BASE}/inspection-reports?per_page=100`;
const API_INSPECTION_REPORTS_LEGACY =
    "https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/points_image?per_page=100";
const API_MEDIA_UPLOAD = "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/media";

const emptyInfo = {
    windFarm: "",
    customer: "",
    date: "",
    windTurbine: "",
    bladeType: "Other",
    bladeNumber: "",
    inspector: "",
};

const normalizeDamage = (damage = {}) => {
    const photos = Array.isArray(damage.photos) ? damage.photos.filter(Boolean) : [];

    return {
        description: damage.description || "",
        shortDescription: damage.shortDescription || "",
        priority: damage.priority || "Medium",
        radius: damage.radius || "",
        location: damage.location || "",
        dimension: damage.dimension || "",
        photos,
        previews: photos,
        x: Number.isFinite(Number(damage.x)) ? Number(damage.x) : 50,
        y: Number.isFinite(Number(damage.y)) ? Number(damage.y) : 50,
        synced: damage.synced ?? true,
    };
};

const uploadInspectionPhoto = async (file) => {
    if (!(file instanceof File)) return file;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(API_MEDIA_UPLOAD, withAuth({
        method: "POST",
        credentials: "include",
        body: formData,
    }));

    if (!response.ok) {
        throw new Error("Errore upload foto ispezione");
    }

    const data = await response.json();
    return data?.source_url || data?.sourceUrl || data?.guid?.rendered || null;
};

const normalizeDamageForSync = async (damage = {}) => {
    const photos = Array.isArray(damage.photos) ? damage.photos.filter(Boolean) : [];
    const uploadedPhotos = [];

    for (const photo of photos) {
        uploadedPhotos.push(await uploadInspectionPhoto(photo));
    }

    return {
        ...normalizeDamage(damage),
        photos: uploadedPhotos.filter(Boolean),
        previews: uploadedPhotos.filter(Boolean),
    };
};

const normalizeReport = (report = {}) => {
    const title =
        typeof report.title === "string"
            ? report.title
            : report.title?.rendered || "";

    return {
        ...report,
        id: report.id ?? report.reportId ?? Date.now(),
        title: title || "Untitled",
        date: report.date || report.info?.date || "",
        modified: report.modified || report.lastModified || "",
        lastModified: report.lastModified || report.modified || report.date || "",
        info: {
            ...emptyInfo,
            ...(report.info || {}),
        },
        blades: {
            A: Array.isArray(report.blades?.A) ? report.blades.A.map(normalizeDamage) : [],
            B: Array.isArray(report.blades?.B) ? report.blades.B.map(normalizeDamage) : [],
            C: Array.isArray(report.blades?.C) ? report.blades.C.map(normalizeDamage) : [],
        },
        synced: report.synced ?? true,
    };
};

const buildSyncPayload = async (report) => {
    const normalized = normalizeReport(report);
    const blades = {
        A: await Promise.all((report.blades?.A || normalized.blades.A || []).map(normalizeDamageForSync)),
        B: await Promise.all((report.blades?.B || normalized.blades.B || []).map(normalizeDamageForSync)),
        C: await Promise.all((report.blades?.C || normalized.blades.C || []).map(normalizeDamageForSync)),
    };
    return {
        type: "inspection-report",
        reportId: normalized.id,
        localId: normalized.id,
        lastModified: normalized.lastModified || normalized.modified || new Date().toISOString(),
        data: {
            ...normalized,
            blades,
        },
    };
};

const postInspectionReport = async (payload) => {
    const response = await fetch(`${API_BASE}/inspection-report`, withAuth({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }));

    if (!response.ok) throw new Error("Errore sync ispezioni");
    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Sync ispezioni rifiutata");
    return result;
};

const isMeaningfulValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    return true;
};

const mergeInfo = (serverInfo = {}, localInfo = {}) => {
    const keys = new Set([...Object.keys(serverInfo || {}), ...Object.keys(localInfo || {})]);
    const merged = {};

    keys.forEach((key) => {
        const localValue = localInfo?.[key];
        const serverValue = serverInfo?.[key];
        merged[key] = isMeaningfulValue(localValue) ? localValue : (serverValue ?? "");
    });

    return merged;
};

const mergeReports = (serverReports = [], localReports = []) => {
    const server = Array.isArray(serverReports) ? serverReports.map(normalizeReport) : [];
    const local = Array.isArray(localReports) ? localReports.map(normalizeReport) : [];

    const merged = server.map((serverReport) => {
        const localReport = local.find((r) => String(r.id) === String(serverReport.id));
        if (!localReport) return serverReport;
        const mergedTitle = isMeaningfulValue(localReport.title) ? localReport.title : serverReport.title;

        return {
            ...serverReport,
            ...localReport,
            title: mergedTitle,
            info: mergeInfo(serverReport.info, localReport.info),
            blades: {
                A: localReport.blades.A.length ? localReport.blades.A : serverReport.blades.A,
                B: localReport.blades.B.length ? localReport.blades.B : serverReport.blades.B,
                C: localReport.blades.C.length ? localReport.blades.C : serverReport.blades.C,
            },
        };
    });

    local.forEach((localReport) => {
        if (!server.some((serverReport) => String(serverReport.id) === String(localReport.id))) {
            merged.push(localReport);
        }
    });

    return merged;
};

const useInspectionReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadReports = async () => {
        setLoading(true);
        setError(null);

        try {
            const offlineRaw = localStorage.getItem("inspectionReports");
            const offline = offlineRaw ? JSON.parse(offlineRaw) : [];
            const localNormalized = Array.isArray(offline) ? offline.map(normalizeReport) : [];
            setReports(localNormalized);

            let serverData = [];
            const response = await fetch(API_INSPECTION_REPORTS, withAuth({ method: "GET" }));

            if (response.ok) {
                serverData = await response.json();
            } else {
                const legacyResponse = await fetch(API_INSPECTION_REPORTS_LEGACY, withAuth({ method: "GET" }));
                if (!legacyResponse.ok) {
                    throw new Error("Errore caricamento report di ispezione");
                }
                serverData = await legacyResponse.json();
            }

            const serverNormalized = Array.isArray(serverData) ? serverData.map(normalizeReport) : [];
            const merged = mergeReports(serverNormalized, localNormalized);

            setReports(merged);
            localStorage.setItem("inspectionReports", JSON.stringify(merged));
        } catch (err) {
            setError(err.message || "Errore sconosciuto");
        } finally {
            setLoading(false);
        }
    };

    const saveReportOffline = async (report) => {
        const reportId = report.id ?? report.reportId ?? Date.now();
        const normalized = normalizeReport({ ...report, id: reportId, synced: false });
        setReports((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((r) => String(r.id) === String(normalized.id));
            if (index >= 0) {
                updated[index] = { ...updated[index], ...normalized };
            } else {
                updated.push(normalized);
            }
            localStorage.setItem("inspectionReports", JSON.stringify(updated));
            return updated;
        });

        const syncItem = await buildSyncPayload({
            ...normalized,
            blades: report.blades || normalized.blades,
        });

        if (navigator.onLine) {
            await clearQueuedSyncItem(syncItem);
            const result = await postInspectionReport(syncItem);
            await clearQueuedSyncItem(syncItem);
            setReports((prev) => {
                const updated = prev.map((item) =>
                    String(item.id) === String(normalized.id)
                        ? { ...item, synced: true, lastModified: result.lastModified || item.lastModified }
                        : item
                );
                localStorage.setItem("inspectionReports", JSON.stringify(updated));
                return updated;
            });
            return result;
        }

        await addToSyncQueue(syncItem);
    };

    const deleteReport = (id) => {
        setReports((prev) => {
            const updated = prev.filter((r) => String(r.id) !== String(id));
            localStorage.setItem("inspectionReports", JSON.stringify(updated));
            return updated;
        });
    };

    const syncReports = async () => {};

    useEffect(() => {
        loadReports();
    }, []);

    return { reports, setReports, loading, error, saveReportOffline, syncReports, deleteReport };
};

export default useInspectionReports;
