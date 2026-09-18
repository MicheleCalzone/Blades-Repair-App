import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSync } from "./hooks/useSync";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.scss";

import Home from "./pages/Home";
import TechnicalReportList from "./pages/TechnicalReportList";
import TechnicalReportNew from "./pages/TechnicalReportNew";

import InspectionReportList from "./pages/InspectionReportList.jsx";
import InspectionReportNew from "./pages/InspectionReportNew.jsx";
import {
    getStoredAuth,
    loginWithWpCredentials,
    logoutSession,
    persistAuth,
} from "./services/auth";
import logo from "./assets/logo.svg";

const LoginScreen = ({ onLogin, loading, error }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onLogin({ username, password });
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <img src={logo} alt="Logo" className="logo"/>

                <form onSubmit={handleSubmit}>
                    <label>
                        Username
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Inserisci la tua password WordPress"
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Accesso..." : "Accedi"}
                    </button>
                </form>
            </div>
        </div>
    );
};

function App() {
    const [auth, setAuth] = useState(() => getStoredAuth());
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    useSync(auth.isAuthenticated);

    const handleLogin = async ({ username, password }) => {
        setLoginLoading(true);
        setLoginError("");

        try {
            const data = await loginWithWpCredentials({ username, password, deviceName: "Blades Repair App" });
            const nextAuth = persistAuth(username, data.token, data.expires_at, data.user || null);
            setAuth(nextAuth);
        } catch (err) {
            setLoginError(err.message || "Accesso non riuscito");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutSession();
        setAuth({ username: "", token: "", expiresAt: "", isAuthenticated: false, user: null });
        setLoginError("");
    };

    if (!auth.isAuthenticated) {
        return (
            <LoginScreen
                onLogin={handleLogin}
                loading={loginLoading}
                error={loginError}
            />
        );
    }

    return (
        <Router>
            <Navbar onLogout={handleLogout} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/technical-reports" element={<TechnicalReportList />} />
                <Route path="/technical-reports/new" element={<TechnicalReportNew />} />
                <Route path="/technical-reports/:id" element={<TechnicalReportNew />} />

                <Route path="/inspection-reports" element={<InspectionReportList />} />
                <Route path="/inspection-reports/new" element={<InspectionReportNew />} />
                <Route path="/inspection-reports/:id" element={<InspectionReportNew />} />
            </Routes>

            <Footer />
        </Router>
    );
}

export default App;
