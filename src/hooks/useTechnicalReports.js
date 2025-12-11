import { useState, useEffect } from "react";

const API_REPORT_TECNICI = "https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/report-tecnici";

const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split(".");
    if (parts.length !== 3) return "";
    const year = `20${parts[2]}`;
    return `${year}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
};

export const useTechnicalReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Recupera URL foto da API WP Media
    const fetchPhotoUrl = async (id) => {
        try {
            const res = await fetch(`https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/media/${id}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.source_url || null;
        } catch {
            return null;
        }
    };

    const loadReports = async () => {
        setLoading(true);
        try {
            const offlineData = localStorage.getItem("technicalReports");
            if (offlineData) setReports(JSON.parse(offlineData));

            const res = await fetch(API_REPORT_TECNICI);
            if (!res.ok) throw new Error("Errore recupero report tecnici");
            const data = await res.json();

            const prepared = await Promise.all(data.map(async (r) => {
                const meta = r.meta || {};

                const parseBladeItems = async (items, bladeLetter) => {
                    if (!items || !Array.isArray(items)) return [];
                    return await Promise.all(items.map(async (item) => {
                        // Recupera URL foto
                        const photoIds = item[`photo_${bladeLetter.toLowerCase()}`] || [];
                        const photos = await Promise.all(photoIds.map(id => fetchPhotoUrl(id)));

                        return {
                            radius: item.radius || "",
                            position: item.position || "",
                            task: item.completed_task || "",
                            description: item[`editor_${bladeLetter.toLowerCase()}`] || "",
                            photos: photos.filter(p => p), // solo URL validi
                        };
                    }));
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
            }));

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
        const idx = updated.findIndex(r => r.id === report.id);
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
