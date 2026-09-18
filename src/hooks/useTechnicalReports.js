// javascript
// src/hooks/useTechnicalReports.js
import { useState, useEffect } from "react";
import { get, set } from "idb-keyval";
import { addToSyncQueue, syncNow } from "../services/syncService";
import { withAuth } from "../services/auth";

const API_REPORT_TECNICI =
    "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/technical-reports?per_page=10";

// Formatta le date in un formato riconosciuto dall'input type="date"
const formatDateForInput = (dateStr) => {
    if (!dateStr && dateStr !== 0) return "";

    const value = String(dateStr).trim();
    if (!value) return "";

    const isoMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoMatch) return isoMatch[0];

    const slashMatch = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (slashMatch) {
        const [, d, m, y] = slashMatch;
        const year = y.length === 2 ? `20${y}` : y;
        return `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const dotMatch = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
    if (dotMatch) {
        const [, d, m, y] = dotMatch;
        const year = y.length === 2 ? `20${y}` : y;
        return `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const timeMatch = value.match(/^\d{4}-\d{2}-\d{2}T/);
    if (timeMatch) return value.split("T")[0];

    return "";
};

const emptyInfo = {
    name: "",
    customer: "",
    windfarm: "",
    wtgId: "",
    wtgType: "",
    hubHeight: "",
    repairBy: "Blades Repair Srl",
    technician: "",
    startDate: "",
    endDate: "",
    reportDate: "",
};

const emptyBlades = { A: [], B: [], C: [] };

const normalizeBladeArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    if (typeof value === "object") return [value];
    return [];
};

const normalizeTechnicalReport = (report = {}) => {
    const id = report.id ?? report.ID ?? report.reportId ?? Date.now();
    const rawTitle = report.title?.rendered || report.title || report.info?.name || "";

    return {
        ...report,
        id,
        title: rawTitle,
        info: {
            ...emptyInfo,
            ...(report.info || {}),
        },
        blades: {
            A: normalizeBladeArray(report.blades?.A),
            B: normalizeBladeArray(report.blades?.B),
            C: normalizeBladeArray(report.blades?.C),
        },
        synced: report.synced ?? false,
        lastModified: report.lastModified || report.modified || new Date().toISOString(),
    };
};

const API_MEDIA_UPLOAD = "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/media";

const dataUrlToBlob = (dataUrl) => {
    const [header, payload] = dataUrl.split(",");
    const mime = (header.match(/data:(.*?);base64/) || ["", "image/jpeg"])[1];
    const binary = atob(payload);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
};

const uploadTechnicalPhoto = async (photo) => {
    if (photo === null || photo === undefined || photo === "") return null;

    if (typeof photo === "string") {
        const trimmed = photo.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("http")) {
            try {
                const res = await fetch(API_MEDIA_UPLOAD, withAuth({
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ url: trimmed }),
                }));

                if (res.status === 401 || res.status === 403) {
                    return trimmed;
                }
                if (!res.ok) return trimmed;

                const data = await res.json();
                return data?.id ?? data?.ID ?? trimmed;
            } catch (error) {
                console.warn("Import media remoto fallito, mantiene URL locale", error);
                return trimmed;
            }
        }
        if (trimmed.startsWith("data:")) {
            try {
                const blob = dataUrlToBlob(trimmed);
                const formData = new FormData();
                formData.append("file", blob, `technical-report-${Date.now()}.jpg`);
                const res = await fetch(API_MEDIA_UPLOAD, withAuth({
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }));

                if (res.status === 401 || res.status === 403) {
                    return trimmed;
                }
                if (!res.ok) return null;

                const data = await res.json();
                return data?.id ?? data?.ID ?? trimmed;
            } catch (error) {
                console.warn("Upload media tecnico fallito, mantiene dato locale", error);
                return trimmed;
            }
        }
        if (/^\d+$/.test(trimmed)) return Number(trimmed);
        return trimmed;
    }

    if (typeof photo === "number") return photo;
    if (typeof photo === "object") {
        const id = photo.id ?? photo.ID ?? photo.mediaId ?? photo.media_id ?? null;
        if (id !== null && id !== undefined) return id;
        const url = photo.url ?? photo.src ?? photo.image ?? photo.link ?? null;
        if (url) return uploadTechnicalPhoto(url);
    }

    return null;
};

const normalizeTechnicalReportForSync = async (report) => {
    const normalized = normalizeTechnicalReport(report);
    const syncBlades = {};

    for (const blade of ["A", "B", "C"]) {
        syncBlades[blade] = await Promise.all((normalized.blades?.[blade] || []).map(async (item = {}) => {
            const photoList = Array.isArray(item.photos) ? item.photos : [];
            const uploadedPhotos = await Promise.all(photoList.map(async (photo) => uploadTechnicalPhoto(photo)));

            return {
                ...item,
                radius: item.radius || "",
                position: item.position || "",
                task: item.task || "",
                description: item.description || "",
                photos: uploadedPhotos.filter((value) => value !== null && value !== undefined && value !== ""),
            };
        }));
    }

    return {
        ...normalized,
        blades: syncBlades,
    };
};

const buildSyncPayload = async (report) => {
    const normalized = await normalizeTechnicalReportForSync(report);

    return {
        type: "report",
        reportId: normalized.id,
        localId: normalized.id,
        lastModified: normalized.lastModified,
        data: normalized,
    };
};

const getTimeValue = (value) => {
    if (!value) return 0;
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
};

const countPhotosInBladeItems = (items = []) => {
    const arr = Array.isArray(items) ? items : [];
    return arr.reduce((count, item) => {
        if (!item || !Array.isArray(item.photos)) return count;
        return count + item.photos.filter(Boolean).length;
    }, 0);
};

const countPhotosInBlades = (blades = {}) => {
    const total = ["A", "B", "C"].reduce((sum, blade) => {
        return sum + countPhotosInBladeItems(blades?.[blade]);
    }, 0);
    return total;
};

const mergeBladeItems = (localItems = [], serverItems = []) => {
    const localArr = Array.isArray(localItems) ? localItems : [];
    const serverArr = Array.isArray(serverItems) ? serverItems : [];

    if (!localArr.length) return serverArr;
    if (!serverArr.length) return localArr;

    const localCount = countPhotosInBladeItems(localArr);
    const serverCount = countPhotosInBladeItems(serverArr);

    return localCount >= serverCount ? localArr : serverArr;
};

const mergeTechnicalReports = (serverReports = [], localReports = []) => {
    const serverArr = Array.isArray(serverReports) ? serverReports.map(normalizeTechnicalReport) : [];
    const localArr = Array.isArray(localReports) ? localReports.map(normalizeTechnicalReport) : [];

    const merged = serverArr.map((serverReport) => {
        const localReport = localArr.find((item) => String(item.id) === String(serverReport.id));
        if (!localReport) return serverReport;

        const localPhotoCount = countPhotosInBlades(localReport.blades);
        const serverPhotoCount = countPhotosInBlades(serverReport.blades);
        const localIsNewer = getTimeValue(localReport.lastModified) > getTimeValue(serverReport.lastModified);
        const serverIsMoreComplete = serverPhotoCount > localPhotoCount;

        const useLocal = localIsNewer && !serverIsMoreComplete && localReport.synced === false;

        const mergedTitle = (useLocal ? localReport.title : serverReport.title || localReport.title || "").trim() || "Untitled";

        const mergedInfo = {
            ...serverReport.info,
            ...localReport.info,
        };

        const pickBlade = (localBlade, serverBlade) => {
            if (useLocal) return mergeBladeItems(localBlade, serverBlade);
            return mergeBladeItems(serverBlade, localBlade);
        };

        const mergedBlades = {
            A: pickBlade(localReport.blades?.A, serverReport.blades?.A),
            B: pickBlade(localReport.blades?.B, serverReport.blades?.B),
            C: pickBlade(localReport.blades?.C, serverReport.blades?.C),
        };

        const mergedReport = {
            ...serverReport,
            ...localReport,
            title: mergedTitle,
            info: mergedInfo,
            blades: mergedBlades,
            lastModified: useLocal ? localReport.lastModified : serverReport.lastModified,
        };

        return mergedReport;
    });

    localArr.forEach((localReport) => {
        if (!serverArr.some((serverReport) => String(serverReport.id) === String(localReport.id))) {
            merged.push(localReport);
        }
    });

    return merged.sort((a, b) => getTimeValue(b.lastModified) - getTimeValue(a.lastModified));
};

const normalizePhotoReference = (photo) => {
    if (photo === null || photo === undefined || photo === "") return null;
    if (typeof photo === "string") {
        const trimmed = photo.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("http") || trimmed.startsWith("data:")) return trimmed;
        if (/^\d+$/.test(trimmed)) return Number(trimmed);
        return trimmed;
    }
    if (typeof photo === "number") return photo;
    if (typeof photo === "object") {
        const id = photo.id ?? photo.ID ?? photo.mediaId ?? photo.media_id ?? null;
        if (id !== null && id !== undefined) return normalizePhotoReference(id);
        const url = photo.url ?? photo.src ?? photo.image ?? photo.link ?? null;
        if (url) return normalizePhotoReference(url);
    }
    return null;
};

// --- Fetch immagini tramite endpoint WordPress /blades/v1/image ---
// Accetta URL, data URL, ID numerico, stringa numerica o oggetto con id/url.
const fetchAndStoreImage = async (photoInput) => {
    try {
        const normalized = normalizePhotoReference(photoInput);
        if (!normalized) return null;

        if (typeof normalized === "string" && (normalized.startsWith("http") || normalized.startsWith("data:"))) {
            return normalized;
        }

        const id = Number(normalized);
        if (!Number.isFinite(id) || id <= 0) return typeof normalized === "string" ? normalized : null;

        const key = `photo_${id}`;

        const cached = await get(key);
        if (cached) return cached;

        const url = `https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/image?id=${id}`;
        const res = await fetch(url, withAuth({ method: "GET" }));
        if (!res.ok) throw new Error("Errore fetch immagine");

        const data = await res.json();
        if (!data || !data.url) return null;

        await set(key, data.url);
        return data.url;
    } catch (err) {
        console.error("Errore caricamento foto", err);
        return null;
    }
};

export const useTechnicalReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadReports = async () => {
        setLoading(true);
        try {
            const offlineData = localStorage.getItem("technicalReports");
            const localReports = offlineData ? JSON.parse(offlineData) : [];
            setReports(Array.isArray(localReports) ? localReports.map(normalizeTechnicalReport) : []);

            const res = await fetch(API_REPORT_TECNICI, withAuth({ method: "GET" }));
            if (!res.ok) throw new Error("Errore recupero report tecnici");
            const data = await res.json();

            const prepared = await Promise.all(
                data.map(async (r) => {
                    const rawMeta = r.meta || {};
                    const info = r.info || {};
                    const incomingBlades = r.blades && Object.keys(r.blades).length ? r.blades : {
                        A: rawMeta.items_of_blade_a || [],
                        B: rawMeta.items_of_blade_b || [],
                        C: rawMeta.items_of_blade_c || [],
                    };

                    const parseBladeItems = async (items, bladeLetter) => {
                        const source = Array.isArray(items) ? items : items ? [items] : [];

                        return Promise.all(
                            source.filter((item) => item && typeof item === "object").map(async (item) => {
                                const photoKey = `photo_${bladeLetter.toLowerCase()}`;
                                const editorKey = `editor_${bladeLetter.toLowerCase()}`;
                                const rawPhotos = item[photoKey] ?? item.photos ?? [];
                                const photoList = Array.isArray(rawPhotos) ? rawPhotos : (rawPhotos ? [rawPhotos] : []);

                                const normalized = photoList
                                    .map((p) => normalizePhotoReference(p))
                                    .filter(Boolean);

                                const photos = await Promise.all(
                                    normalized.map(async (np) => fetchAndStoreImage(np))
                                );

                                return {
                                    radius: item.radius || "",
                                    position: item.position || "",
                                    task: item.completed_task || item.task || "",
                                    description: item[editorKey] || item.description || "",
                                    photos: photos.filter(Boolean),
                                };
                            })
                        );
                    };

                    const title = r.title?.rendered || r.title || info.name || rawMeta.name || "";

                    return {
                        id: r.id,
                        title,
                        info: {
                            name: info.name || rawMeta.name || title || "",
                            customer: info.customer || rawMeta.customer || "",
                            windfarm: info.windfarm || rawMeta.windfarm || "",
                            wtgId: info.wtgId || rawMeta["wtg-id-nr"] || "",
                            wtgType: info.wtgType || rawMeta.wtg_type || "",
                            hubHeight: info.hubHeight || rawMeta.hub_height || "",
                            repairBy: info.repairBy || rawMeta.repair_completed_by || "Blades Repair Srl",
                            technician: info.technician || rawMeta.service_technician || "",
                            startDate: formatDateForInput(info.startDate || rawMeta.start_date),
                            endDate: formatDateForInput(info.endDate || rawMeta.end_date),
                            reportDate: formatDateForInput(info.reportDate || rawMeta.report_issue_date),
                        },
                        blades: {
                            A: await parseBladeItems(incomingBlades.A ?? rawMeta.items_of_blade_a, "A"),
                            B: await parseBladeItems(incomingBlades.B ?? rawMeta.items_of_blade_b, "B"),
                            C: await parseBladeItems(incomingBlades.C ?? rawMeta.items_of_blade_c, "C"),
                        },
                        synced: true,
                        lastModified: r.modified || r.lastModified,
                    };
                })
            );

            const merged = mergeTechnicalReports(prepared, localReports);
            setReports(merged);
            localStorage.setItem("technicalReports", JSON.stringify(merged));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveReportOffline = async (report) => {
        const normalized = normalizeTechnicalReport(report);
        setReports((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex((r) => String(r.id) === String(normalized.id));
            if (idx >= 0) updated[idx] = normalized;
            else updated.push(normalized);
            localStorage.setItem("technicalReports", JSON.stringify(updated));
            return updated;
        });

        const payload = await buildSyncPayload(normalized);
        await addToSyncQueue(payload);
        if (navigator.onLine) {
            await syncNow();
        }
    };

    const deleteReport = (id) => {
        setReports((prev) => {
            const updated = prev.filter((r) => String(r.id) !== String(id));
            localStorage.setItem("technicalReports", JSON.stringify(updated));
            return updated;
        });
    };

    useEffect(() => {
        loadReports();
    }, []);

    return { reports, setReports, loading, error, saveReportOffline, deleteReport };
};