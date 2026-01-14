// javascript
// src/hooks/useTechnicalReports.js
import { useState, useEffect } from "react";
import { get, set } from "idb-keyval";

const API_REPORT_TECNICI =
    "https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/report-tecnici?per_page=10";

// Formatta le date dal formato DD.MM.YY a YYYY-MM-DD
const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split(".");
    if (parts.length !== 3) return "";
    const year = `20${parts[2]}`;
    return `${year}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
};

// --- Fetch immagini tramite endpoint WordPress /blades/v1/image ---
// Ora accetta sia un oggetto foto che un id (number|string) e normalizza l'id.
const fetchAndStoreImage = async (photoInput) => {
    try {
        if (photoInput === null || photoInput === undefined) return null;

        // Normalizza l'id: può essere un numero, una stringa o un oggetto { id } / { ID } / { mediaId }
        const id =
            typeof photoInput === "object"
                ? photoInput.id ?? photoInput.ID ?? photoInput.mediaId ?? null
                : photoInput;

        if (!id && id !== 0) return null;

        const key = `photo_${id}`;

        // Controlla IndexedDB prima
        const cached = await get(key);
        if (cached) return cached;

        // Altrimenti fetch tramite endpoint WordPress
        const url = `https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/image?id=${id}`;
        const res = await fetch(url);
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
            if (offlineData) setReports(JSON.parse(offlineData));

            const res = await fetch(API_REPORT_TECNICI);
            if (!res.ok) throw new Error("Errore recupero report tecnici");
            const data = await res.json();

            const prepared = await Promise.all(
                data.map(async (r) => {
                    const meta = r.meta || {};

                    const parseBladeItems = async (items, bladeLetter) => {
                        if (!items || !Array.isArray(items)) return [];
                        return Promise.all(
                            items.map(async (item) => {
                                // Prendi le foto raw (possono essere url, id numerici, stringhe numeriche o oggetti)
                                const rawPhotos = item[`photo_${bladeLetter.toLowerCase()}`] || [];

                                // Normalizza: mantieni URL/data:, estrai id da oggetti, lascia numeri/stringhe numeriche
                                const normalized = rawPhotos
                                    .map((p) => {
                                        if (!p && p !== 0) return null;
                                        if (typeof p === "string") return p;
                                        if (typeof p === "object") return p.id ?? p.ID ?? p.mediaId ?? null;
                                        return p;
                                    })
                                    .filter(Boolean);

                                // Per ogni voce: se è già un URL (http o data:) lo uso; altrimenti provo a fetchare tramite id
                                const photos = await Promise.all(
                                    normalized.map(async (np) => {
                                        if (typeof np === "string" && (np.startsWith("http") || np.startsWith("data:"))) {
                                            return np;
                                        }
                                        // se è stringa numerica, converto in number
                                        const id = typeof np === "string" && /^\d+$/.test(np) ? Number(np) : np;
                                        return await fetchAndStoreImage(id);
                                    })
                                );

                                return {
                                    radius: item.radius || "",
                                    position: item.position || "",
                                    task: item.completed_task || "",
                                    description: item[`editor_${bladeLetter.toLowerCase()}`] || "",
                                    photos: photos.filter(Boolean),
                                };
                            })
                        );
                    };

                    return {
                        id: r.id,
                        title: r.title?.rendered || "",
                        info: {
                            customer: meta.customer || "",
                            windfarm: meta.windfarm || "",
                            wtgId: meta["wtg-id-nr"] || "",
                            wtgType: meta.wtg_type || "",
                            hubHeight: meta.hub_height || "",
                            repairBy: meta.repair_completed_by || "Blades Repair Srl",
                            technician: meta.service_technician || "",
                            startDate: formatDateForInput(meta.start_date),
                            endDate: formatDateForInput(meta.end_date),
                            reportDate: formatDateForInput(meta.report_issue_date),
                        },
                        blades: {
                            A: await parseBladeItems(meta.items_of_blade_a, "A"),
                            B: await parseBladeItems(meta.items_of_blade_b, "B"),
                            C: await parseBladeItems(meta.items_of_blade_c, "C"),
                        },
                        synced: true,
                        lastModified: r.modified,
                    };
                })
            );

            setReports(prepared);
            localStorage.setItem("technicalReports", JSON.stringify(prepared));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveReportOffline = (report) => {
        const updated = [...reports];
        const idx = updated.findIndex((r) => r.id === report.id);
        if (idx >= 0) updated[idx] = report;
        else updated.push(report);
        setReports(updated);
        localStorage.setItem("technicalReports", JSON.stringify(updated));
    };

    useEffect(() => {
        loadReports();
    }, []);

    return { reports, setReports, loading, error, saveReportOffline };
};