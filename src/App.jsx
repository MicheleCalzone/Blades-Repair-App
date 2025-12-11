import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.scss";

import Home from "./pages/Home";
import TechnicalReportList from "./pages/TechnicalReportList";
import TechnicalReportNew from "./pages/TechnicalReportNew";

import InspectionReportList from "./pages/InspectionReportList.jsx";
import InspectionReportNew from "./pages/InspectionReportNew.jsx";


function App() {
    return (
        <Router>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/technical-reports" element={<TechnicalReportList />} />
                <Route path="/technical-reports/new" element={<TechnicalReportNew />} />
                <Route path="/technical-reports/:id" element={<TechnicalReportNew />} />

                <Route path="/inspection-reports" element={<InspectionReportList />} />
                <Route path="/inspection-reports/new" element={<InspectionReportNew />} />

            </Routes>

            <Footer />
        </Router>
    );
}

export default App;
