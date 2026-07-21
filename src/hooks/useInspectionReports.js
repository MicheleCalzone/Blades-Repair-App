import { useState, useEffect } from "react";

const API_BASE = "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1";
const API_INSPECTION_REPORTS = `${API_BASE}/inspection-reports?per_page=100`;
const API_INSPECTION_REPORTS_LEGACY =
    "https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/points_image?per_page=100";

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
            const response = await fetch(API_INSPECTION_REPORTS);

            if (response.ok) {
                serverData = await response.json();
            } else {
                const legacyResponse = await fetch(API_INSPECTION_REPORTS_LEGACY);
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

    const saveReportOffline = (report) => {
        const normalized = normalizeReport({ ...report, synced: false });
        setReports((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((r) => String(r.id) === String(normalized.id));
            if (index >= 0) {
                updated[index] = normalized;
            } else {
                updated.push(normalized);
            }
            localStorage.setItem("inspectionReports", JSON.stringify(updated));
            return updated;
        });
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
