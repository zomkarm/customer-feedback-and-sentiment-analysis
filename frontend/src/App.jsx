import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Page imports
import LandingPage from "./pages/landing/LandingPage";
import CompanyLogin from "./pages/auth/CompanyLogin";
import CompanySignup from "./pages/auth/CompanySignup";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminSignup from "./pages/auth/AdminSignup";
import CompanyDashboard from "./pages/company/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import PublicForm from "./pages/feedback/PublicForm";

const App = () => {
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setAdminToken(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  };
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Company Auth */}
        <Route path="/login" element={<CompanyLogin />} />
        <Route path="/signup" element={<CompanySignup />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Dashboards */}
        {/* <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        <Route
          path="/company/dashboard"
          element={<CompanyDashboard onLogout={handleLogout} />}
        />
        <Route
          path="/admin/dashboard"
          element={
            adminToken ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Feedback Form Embed */}
        <Route path="/feedback/:companyId" element={<PublicForm />} />
      </Routes>
    </Router>
  );
};

export default App;
