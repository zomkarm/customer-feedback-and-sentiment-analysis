// components/CompanyProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const CompanyProtectedRoute = ({ children }) => {
  const auth = localStorage.getItem("companyAuth");
  if (!auth) return <Navigate to="/login" />;
  return children;
};

export default CompanyProtectedRoute;
