import { useState, useEffect } from "react";

// URL REST API
//const API_REPORT_TECNICI = "https://www.blades-repair.com/wp-json/wp/v2/report-tecnici";
//const API_REPORT_ISPEZIONI = "https://www.blades-repair.com/wp-json/pods/v1/points_image";

const API_REPORT_TECNICI = "https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/report-tecnici";
const API_REPORT_ISPEZIONI = "https://mirodesign.it/off-line/blades-repair/wp-json/pods/v1/points_image";

export const useTechnicalReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funzione per caricare dati dal server o dal localStorage
    const loadReports = async () => {
        setLoading(true);
        try {
            const offlineData = localStorage.getItem("technicalReports");
            if (offlineData) {
                setReports(JSON.parse(offlineData));
            }

            // Fetch dai REST API
            const res = await fetch(API_REPORT_TECNICI);
            if (!res.ok) throw new Error("Errore nel recupero dei report tecnici");
            const data = await res.json();

            setReports(data);

            // Salvataggio locale
            localStorage.setItem("technicalReports", JSON.stringify(data));
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Funzione per salvare un nuovo report offline
    const saveReportOffline = (report) => {
        const updated = [...reports, report];
        setReports(updated);
        localStorage.setItem("technicalReports", JSON.stringify(updated));
    };

    // Sincronizzazione futura (quando c'è connessione)
    const syncReports = async () => {
        if (!navigator.onLine) return;
        try {
            const offlineReports = JSON.parse(localStorage.getItem("technicalReports")) || [];

            // Per ogni report non ancora sul server, POST su WordPress
            for (const report of offlineReports) {
                if (!report.synced) {
                    await fetch(API_REPORT_TECNICI, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(report),
                    });
                    report.synced = true;
                }
            }

            // Aggiorno localStorage con flag synced
            localStorage.setItem("technicalReports", JSON.stringify(offlineReports));
        } catch (err) {
            console.error("Errore sincronizzazione:", err);
        }
    };

    useEffect(() => {
        loadReports();

        // Event listener per sincronizzare quando torna online
        window.addEventListener("online", syncReports);

        return () => {
            window.removeEventListener("online", syncReports);
        };
    }, []);

    return { reports, loading, error, saveReportOffline, syncReports };
};
