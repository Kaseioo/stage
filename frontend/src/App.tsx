import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import ProcessesPage from './pages/ProcessPage';
import VisualizationsPage from './pages/VisualizationPage';
import SettingsPage from './pages/SettingsPage'; // Example page
import HelpPage from './pages/HelpPage'; // Example page

function App() {
    // --- Mock Authentication ---
    // In a real app, use Context, Zustand, Redux, or check a token
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = useCallback(() => {
        // Simulate successful login
        console.log('User logged in');
        setIsAuthenticated(true);
    }, []);

    const handleLogout = useCallback(() => {
        // Simulate logout
        console.log('User logged out');
        setIsAuthenticated(false);
    }, []);
    // -------------------------

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    !isAuthenticated ? (
                        <LoginPage onLogin={handleLogin} />
                    ) : (
                        <Navigate to="/" replace /> // Redirect if already logged in
                    )
                }
            />
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <MainLayout onLogout={handleLogout} />
                    ) : (
                        <Navigate to="/login" replace /> // Redirect if not logged in
                    )
                }
            >
                {/* Nested Routes within MainLayout */}
                <Route index element={<Navigate to="/processes" replace />} /> {/* Default route */}
                <Route path="processes" element={<ProcessesPage />} />
                <Route path="visualizations" element={<VisualizationsPage />} />
                <Route path="settings" element={<SettingsPage />} /> {/* Example */}
                <Route path="help" element={<HelpPage />} /> {/* Example */}
                {/* Add more routes as needed */}
            </Route>
             {/* Catch-all or Not Found route */}
             <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
    );
}

export default App;
