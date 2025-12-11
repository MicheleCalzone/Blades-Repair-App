import { useState, useEffect } from "react";

const API_INSPECTION_REPORTS = "https://mirodesign.it/off-line/blades-repair/wp-json/pods/v1/points_image";

const useInspectionReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carica dai localStorage o server
    const loadReports = async () => {
        setLoading(true);
        try {
            const offlineData = localStorage.getItem("inspectionReports");
            if (offlineData) {
                setReports(JSON.parse(offlineData));
            }

            const res = await fetch(API_INSPECTION_REPORTS);
            if (!res.ok) throw new Error("Errore caricamento report di ispezione");
            const data = await res.json();

            setReports(data);
            localStorage.setItem("inspectionReports", JSON.stringify(data));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Salvataggio offline
    const saveReportOffline = (report) => {
        const updated = [...reports, report];
        setReports(updated);
        localStorage.setItem("inspectionReports", JSON.stringify(updated));
    };

    // Sincronizzazione quando torni online
    const syncReports = async () => {
        if (!navigator.onLine) return;

        try {
            const offlineReports = JSON.parse(localStorage.getItem("inspectionReports")) || [];

            for (const report of offlineReports) {
                if (!report.synced) {
                    await fetch(API_INSPECTION_REPORTS, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(report),
                    });
                    report.synced = true;
                }
            }

            // Aggiorna localStorage
            localStorage.setItem("inspectionReports", JSON.stringify(offlineReports));
            setReports(offlineReports);
        } catch (err) {
            console.error("Errore sincronizzazione report:", err);
        }
    };

    useEffect(() => {
        loadReports();
        window.addEventListener("online", syncReports);
        return () => {
            window.removeEventListener("online", syncReports);
        };
    }, []);

    return { reports, setReports, loading, error, saveReportOffline, syncReports };
};

export default useInspectionReports;
