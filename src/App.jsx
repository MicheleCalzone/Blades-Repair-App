import React from 'react';

import IconReportAdd from "./assets/IconReportAdd.jsx";
import IconReportList from './assets/IconReportList.jsx';

import Navbar from './components/navbar';
import Footer from './components/footer';
import './App.scss';


function App() {
    const handleNewInspectionReport = () => {
        alert("Apri il form per un nuovo Report Ispezioni");
    };

    const handleListInspectionReports = () => {
        alert("Vai all'elenco dei Report Ispezioni");
    };

    const handleNewTechnicalReport = () => {
        alert("Apri il form per un nuovo Report Tecnico");
    };

    const handleListTechnicalReports = () => {
        alert("Vai all'elenco dei Report Tecnici");
    };

    return (
        <div className="App">
            <Navbar/>

            <div className="report-container">
                {/* Blocco Report Ispezioni */}
                <div className="report-card">
                    <h2>Inspection Report</h2>
                    <div className={"sub-title"}>
                        Create or View all Inspection Report
                    </div>
                    <div className="box-btn">
                        <button className="btn" onClick={handleNewInspectionReport}>
                            <div className="btn-icon">
                                <IconReportAdd className="icon icon-report-add" />
                            </div>
                            <div className="btn-text">
                                Create new report
                            </div>
                        </button>
                        <button className="btn" onClick={handleListInspectionReports}>
                            <div className="btn-icon">
                                <IconReportList className="icon icon-report-list" />
                            </div>
                            <div className="btn-text">
                                View all report
                            </div>
                        </button>
                    </div>
                </div>

                {/* Blocco Report Tecnici */}
                <div className="report-card">
                    <h2>Technical Report</h2>
                    <div className={"sub-title"}>
                        Create or View all Technical Report
                    </div>
                    <div className="box-btn">
                        <button className="btn" onClick={handleNewTechnicalReport}>
                            <div className="btn-icon">
                                <IconReportAdd className="icon icon-report-add" />
                            </div>
                            <div className="btn-text">
                                Create new report
                            </div>
                        </button>
                        <button className="btn" onClick={handleListTechnicalReports}>
                            <div className="btn-icon">
                                <IconReportList className="icon icon-report-list" />
                            </div>
                            <div className="btn-text">
                                View all report
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default App;
