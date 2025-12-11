import { useState, useEffect } from "react";

const API_REPORT_TECNICI = "https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/report-tecnici";

const formatDateForInput = (dateStr) => {
    // converte da DD.MM.YY → YYYY-MM-DD
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

    const loadReports = async () => {
        setLoading(true);
        try {
            const offlineData = localStorage.getItem("technicalReports");
            if (offlineData) setReports(JSON.parse(offlineData));

            const res = await fetch(API_REPORT_TECNICI);
            if (!res.ok) throw new Error("Errore recupero report tecnici");
            const data = await res.json();

            // Prepara i dati: converte date e struttura blades
            const prepared = data.map(r => {
                const meta = r.meta || {};
                return {
                    id: r.id,
                    title: r.title.rendered || "",
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
                        A: meta.items_of_blade_a ? [{
                            radius: meta.items_of_blade_a.radius || "",
                            position: meta.items_of_blade_a.position || "",
                            task: meta.items_of_blade_a.completed_task || "",
                            description: meta.items_of_blade_a.editor_a || "",
                            photos: meta.items_of_blade_a.photo_a || []
                        }] : [],
                        B: meta.items_of_blade_b ? [{
                            radius: meta.items_of_blade_b.radius || "",
                            position: meta.items_of_blade_b.position || "",
                            task: meta.items_of_blade_b.completed_task || "",
                            description: meta.items_of_blade_b.editor_b || "",
                            photos: meta.items_of_blade_b.photo_b || []
                        }] : [],
                        C: meta.items_of_blade_c ? [{
                            radius: meta.items_of_blade_c.radius || "",
                            position: meta.items_of_blade_c.position || "",
                            task: meta.items_of_blade_c.completed_task || "",
                            description: meta.items_of_blade_c.editor_c || "",
                            photos: meta.items_of_blade_c.photo_c || []
                        }] : [],
                    },
                    synced: true,
                    lastModified: r.modified,
                };
            });

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
