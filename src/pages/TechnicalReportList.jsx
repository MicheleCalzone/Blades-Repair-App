import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconReportAdd from "../assets/IconReportAdd";
import IconTrash from "../assets/IconTrash";
import IconEdit from "../assets/IconEdit";
import { useTechnicalReports } from "../hooks/useTechnicalReports";

const TechnicalReportsList = () => {
    const navigate = useNavigate();
    const { reports, loading, error, saveReportOffline } = useTechnicalReports();

    const [filterMonth, setFilterMonth] = useState("");
    const [monthFilteredReports, setMonthFilteredReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchFilteredReports, setSearchFilteredReports] = useState([]);

    // Aggiorno i filtri quando cambiano i report
    useEffect(() => {
        setMonthFilteredReports(reports);
        setSearchFilteredReports(reports);
    }, [reports]);

    const deleteReport = (id) => {
        // per ora solo rimuovo localmente, poi puoi integrare sync su server
        const updatedReports = reports.filter((r) => r.id !== id);
        setMonthFilteredReports(updatedReports);
        setSearchFilteredReports(updatedReports);
    };

    const handleMonthFilter = () => {
        if (filterMonth === "") {
            setMonthFilteredReports(reports);
        } else {
            setMonthFilteredReports(
                reports.filter((r) => {
                    // alcuni report potrebbero non avere month, proviamo a estrarlo da data
                    const month = r.month || (r.date ? new Date(r.date).getMonth() + 1 : null);
                    return month?.toString() === filterMonth;
                })
            );
        }
    };

    const handleSearch = () => {
        setSearchFilteredReports(
            reports.filter((r) => {
                const title = r.title?.rendered || r.title || "";
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

            <button className="btn btn-add-report" onClick={() => navigate("/technical-reports/new")}>
                <IconReportAdd className="icon"/> Nuovo Report
            </button>

            <div className="row-filter">
                {/* Filtro mese */}
                <div className="filters">
                    <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                        <option value="">Tutti i mesi</option>
                        <option value="1">Gennaio</option>
                        <option value="2">Febbraio</option>
                        <option value="3">Marzo</option>
                        <option value="4">Aprile</option>
                        <option value="5">Maggio</option>
                        <option value="6">Giugno</option>
                        <option value="7">Luglio</option>
                        <option value="8">Agosto</option>
                        <option value="9">Settembre</option>
                        <option value="10">Ottobre</option>
                        <option value="11">Novembre</option>
                        <option value="12">Dicembre</option>
                    </select>
                    <button className="btn" onClick={handleMonthFilter}>Filtra</button>
                </div>

                {/* Ricerca per nome */}
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
                        <td
                            className="report-title"
                            onClick={() => navigate(`/technical-reports/${r.id}`)}
                        >
                            {r.title?.rendered || r.title}
                        </td>
                        <td>{r.modified || r.lastModified || "-"}</td>
                        <td>{r.synced ? "Online" : "Offline"}</td>
                        <td className="td-action">
                            <button className="action-btn" onClick={() => navigate(`/technical-reports/${r.id}`)}>
                                <IconEdit className="icon"/>
                            </button>

                            <button className="action-btn" onClick={() => deleteReport(r.id)}>
                                <IconTrash className="icon"/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TechnicalReportsList;
