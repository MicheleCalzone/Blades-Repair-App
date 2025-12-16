import { useState, useEffect } from "react";
import { get, set } from "idb-keyval";

const API_REPORT_TECNICI =
    "https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/report-tecnici?per_page=10";

const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split(".");
    if (parts.length !== 3) return "";
    const year = `20${parts[2]}`;
    return `${year}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
};

// --- Fetch immagini solo da IndexedDB, in produzione scarica se serve ---
const fetchAndStoreImage = async (photoObj) => {
    try {
        // photoObj = { id, source_url }
        const cached = await get(`photo_${photoObj.id}`);
        if (cached) return cached;

        // Solo in produzione scarica dal server
        if (!import.meta.env.DEV && photoObj.source_url) {
            const res = await fetch(photoObj.source_url);
            if (!res.ok) throw new Error("Errore fetch immagine");
            const blob = await res.blob();

            const reader = new FileReader();
            const dataUrl = await new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });

            await set(`photo_${photoObj.id}`, dataUrl);
            return dataUrl;
        }

        // In sviluppo ritorna null (evita CORS)
        return null;
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
            // Carica dati offline se presenti
            const offlineData = localStorage.getItem("technicalReports");
            if (offlineData) setReports(JSON.parse(offlineData));

            // Fetch report da server
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
                                const photos = await Promise.all(
                                    (item[`photo_${bladeLetter.toLowerCase()}`] || []).map(fetchAndStoreImage)
                                );

                                return {
                                    radius: item.radius || "",
                                    position: item.position || "",
                                    task: item.completed_task || "",
                                    description: item[`editor_${bladeLetter.toLowerCase()}`] || "",
                                    photos: photos.filter(Boolean), // rimuove eventuali null
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
