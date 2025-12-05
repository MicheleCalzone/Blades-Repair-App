// src/hooks/useInspectionReports.js
import { useState, useEffect } from "react";

const useInspectionReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                //const res = await fetch("https://www.blades-repair.com/wp-json/pods/v1/points_image");
                const res = await fetch("https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/points_image");
                if (!res.ok) throw new Error("Errore nel caricamento dei report di ispezione");
                const data = await res.json();
                setReports(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const deleteReport = (id) => {
        setReports((prev) => prev.filter((r) => r.id !== id));
    };

    return {
        reports,
        loading,
        error,
        deleteReport,
        setReports, // opzionale se vuoi aggiornare dall’esterno
    };
};

export default useInspectionReports;
