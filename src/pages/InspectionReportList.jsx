import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconReportAdd from "../assets/IconReportAdd";
import IconTrash from "../assets/IconTrash";
import IconEdit from "../assets/IconEdit";
import useInspectionReports from "../hooks/useInspectionReports";

const InspectionReportsList = () => {
    const navigate = useNavigate();
    const { reports, loading, error, deleteReport } = useInspectionReports();

    const [filterMonth, setFilterMonth] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [monthFilteredReports, setMonthFilteredReports] = useState([]);
    const [searchFilteredReports, setSearchFilteredReports] = useState([]);

    useEffect(() => {
        setMonthFilteredReports(reports);
        setSearchFilteredReports(reports);
    }, [reports]);

    const handleMonthFilter = () => {
        if (!filterMonth) return setMonthFilteredReports(reports);
        setMonthFilteredReports(
            reports.filter((r) => {
                const month = r.date ? new Date(r.date).getMonth() + 1 : null;
                return month?.toString() === filterMonth;
            })
        );
    };

    const handleSearch = () => {
        setSearchFilteredReports(
            reports.filter((r) => (r.title?.rendered || "").toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const displayedReports = monthFilteredReports.filter((r) =>
        searchFilteredReports.some((sr) => sr.id === r.id)
    );

    if (loading) return <p>Caricamento report di ispezione...</p>;
    if (error) return <p>Errore: {error}</p>;

    return (
        <div className="page-container page-report-list">
            <h1>Report Ispezioni</h1>
            <button className="btn btn-add-report" onClick={() => navigate("/inspection-reports/new")}>
                <IconReportAdd className="icon" /> Nuovo Report
            </button>

            <div className="row-filter">
                <div className="filters">
                    <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                        <option value="">Tutti i mesi</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('it-IT', { month: 'long' })}</option>
                        ))}
                    </select>
                    <button className="btn" onClick={handleMonthFilter}>Filtra</button>
                </div>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Cerca per nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn" onClick={handleSearch}>Search</button>
                </div>
            </div>

            <table className="reports-table">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Ultima modifica</th>
                    <th>Sincronizzato</th>
                    <th>Azioni</th>
                </tr>
                </thead>
                <tbody>
                {displayedReports.map((r) => (
                    <tr key={r.id}>
                        <td className="report-title" onClick={() => navigate(`/inspection-reports/${r.id}`)}>
                            {r.title?.rendered || r.nome?.rendered || "Untitled"}
                        </td>
                        <td>{r.date || "-"}</td>
                        <td>{r.synced ? "Online" : "Offline"}</td>
                        <td className="td-action">
                            <button className="action-btn" onClick={() => navigate(`/inspection-reports/${r.id}`)}>
                                <IconEdit className="icon" />
                            </button>
                            <button className="action-btn" onClick={() => deleteReport(r.id)}>
                                <IconTrash className="icon" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InspectionReportsList;
