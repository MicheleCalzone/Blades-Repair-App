import React from "react";
import {useNavigate} from "react-router-dom";
import IconReportAdd from "../assets/IconReportAdd";
import IconReportList from "../assets/IconReportList";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">

            <div className="report-container">
                <div className="report-card">

                    <h2>Inspection Report</h2>

                    <div className={"sub-title"}>
                        Create or View all Inspection Report
                    </div>

                    <div className="box-btn">
                        <button class="btn" onClick={() => navigate("/inspection-reports/new")}>
                            <div className="btn-icon">
                                <IconReportAdd className="icon"/>
                            </div>
                            <div className="btn-text">
                                Create new report
                            </div>
                        </button>

                        <button class="btn" onClick={() => navigate("/inspection-reports")}>
                            <div className="btn-icon">
                                <IconReportList className="icon"/>
                            </div>
                            <div className="btn-text">
                                View all report
                            </div>
                        </button>
                    </div>

                </div>

                <div className="report-card">

                    <h2>Technical Report</h2>
                    <div className={"sub-title"}>
                        Create or View all Technical Report
                    </div>

                    <div className="box-btn">
                        <button class="btn" onClick={() => navigate("/technical-reports/new")}>
                            <div className="btn-icon">
                                <IconReportAdd className="icon"/>
                            </div>
                            <div className="btn-text">
                                Create new report
                            </div>
                        </button>
                        <button class="btn" onClick={() => navigate("/technical-reports")}>
                            <div className="btn-icon">
                                <IconReportList className="icon"/>
                            </div>
                            <div className="btn-text">
                                View all report
                            </div>
                        </button>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Home;

