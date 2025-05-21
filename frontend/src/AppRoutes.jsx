import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Page imports
import LandingPage from "./pages/landing/LandingPage";
import CompanyLogin from "./pages/auth/CompanyLogin";
import CompanySignup from "./pages/auth/CompanySignup";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminSignup from "./pages/auth/AdminSignup";
import CompanyDashboard from "./pages/company/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import PublicForm from "./pages/feedback/PublicForm";
import CompanyProtectedRoute from "./components/route/CompanyProtectedRoute";

const AppRoutes = () => {
  const [adminToken, setAdminToken] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // ✅ Now safe to use

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const info = localStorage.getItem("adminInfo");

    setAdminToken(token);
    if (info) setAdminInfo(JSON.parse(info));
    setLoading(false);
  }, [location]); // <-- Reacts on route change

  const handleLogout = () => {
    localStorage.clear();
    setAdminToken(null);
    setAdminInfo(null);
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<CompanyLogin />} />
      <Route path="/signup" element={<CompanySignup />} />
      <Route
        path="/admin/login"
        element={
            <AdminLogin
            setAdminToken={setAdminToken}
            setAdminInfo={setAdminInfo}
            />
        }
        />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/company/dashboard" element={
          <CompanyProtectedRoute>
            <CompanyDashboard />
          </CompanyProtectedRoute>
        } />
        <Route
            path="/admin/dashboard"
            element={
            loading ? null : adminToken ? (
                <AdminDashboard onLogout={handleLogout} adminInfo={adminInfo} />
            ) : (
                <Navigate to="/admin/login" replace />
            )
            }
        />
      <Route path="/feedback/:companyId" element={<PublicForm />} />
    </Routes>
  );
};

export default AppRoutes;