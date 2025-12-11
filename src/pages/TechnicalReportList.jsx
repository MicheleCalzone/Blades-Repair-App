// src/pages/TechnicalReportsList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconReportAdd from "../assets/IconReportAdd";
import IconTrash from "../assets/IconTrash";
import IconEdit from "../assets/IconEdit";
import { useTechnicalReports } from "../hooks/useTechnicalReports";

const TechnicalReportsList = () => {
    const navigate = useNavigate();
    const { reports, loading, error, deleteReport } = useTechnicalReports();

    const [filterMonth, setFilterMonth] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [monthFilteredReports, setMonthFilteredReports] = useState([]);
    const [searchFilteredReports, setSearchFilteredReports] = useState([]);

    // Aggiorna i filtri quando cambiano i report
    useEffect(() => {
        setMonthFilteredReports(reports);
        setSearchFilteredReports(reports);
    }, [reports]);

    const handleMonthFilter = () => {
        if (!filterMonth) return setMonthFilteredReports(reports);

        setMonthFilteredReports(
            reports.filter((r) => {
                // preferisci la data online se disponibile
                const dateStr = r.modified || r.info?.reportDate || r.date;
                if (!dateStr) return false;
                const month = new Date(dateStr).getMonth() + 1;
                return month.toString() === filterMonth;
            })
        );
    };

    const handleSearch = () => {
        setSearchFilteredReports(
            reports.filter((r) => {
                const title = r.title?.rendered || r.info?.customer || "";
                return title.toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    };

    // Intersezione dei due filtri
    const displayedReports = monthFilteredReports.filter((r) =>
        searchFilteredReports.some((sr) => sr.id === r.id)
    );

    if (loading) return <p>Caricamento report...</p>;
    if (error) return <p>Errore: {error}</p>;

    return (
        <div className="page-container page-report-list">
            <h1>Report Tecnici</h1>

            <button
                className="btn btn-add-report"
                onClick={() => navigate("/technical-reports/new")}
            >
                <IconReportAdd className="icon" /> Nuovo Report
            </button>

            <div className="row-filter">
                <div className="filters">
                    <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    >
                        <option value="">Tutti i mesi</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i} value={i + 1}>
                                {new Date(0, i).toLocaleString("it-IT", { month: "long" })}
                            </option>
                        ))}
                    </select>
                    <button className="btn" onClick={handleMonthFilter}>
                        Filtra
                    </button>
                </div>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Cerca per cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            <table className="reports-table">
                <thead>
                <tr>
                    <th>Cliente / Titolo</th>
                    <th>Ultima modifica</th>
                    <th>Sincronizzato</th>
                    <th>Azioni</th>
                </tr>
                </thead>
                <tbody>
                {displayedReports.map((r) => {
                    const title = r.title?.rendered || r.info?.customer || "Untitled";
                    const date = r.modified || r.info?.reportDate || "-";

                    return (
                        <tr key={r.id}>
                            <td
                                className="report-title"
                                onClick={() => navigate(`/technical-reports/${r.id}`)}
                            >
                                {title}
                            </td>
                            <td>{date}</td>
                            <td>{r.synced ? "Online" : "Offline"}</td>
                            <td className="td-action">
                                <button
                                    className="action-btn"
                                    onClick={() => navigate(`/technical-reports/${r.id}`)}
                                >
                                    <IconEdit className="icon" />
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => deleteReport(r.id)}
                                >
                                    <IconTrash className="icon" />
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default TechnicalReportsList;
