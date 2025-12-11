import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const CompanyLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // or "error"

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType(location.state.success ? "success" : "error");
    }
  }, [location]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/company/login`, formData);
      // After successful login API call
      localStorage.setItem("companyAuth", JSON.stringify({
        token: res.data.token,
        companyName: res.data.company.name,
        companyId: res.data.company.id,
      }));
      
      navigate("/company/dashboard", { replace: true });
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        {message && (
          <div
            className={`mb-4 text-sm rounded-md p-3 ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Company Login
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Login
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>

        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
      </form>
    </div>

  );
};

export default CompanyLogin;
