import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

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
      const res = await axios.post("http://localhost:5000/api/company/login", formData);

      // After successful login API call
      localStorage.setItem("companyAuth", JSON.stringify({
        token: res.data.token,
        companyName: res.data.company.name,
        companyId: res.data.company.id,
      }));

      navigate("/company/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-full max-w-md"
      >
        {message && (
        <div className={`alert ${messageType === "success" ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Company Login</h2>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        />

        <button
          type="submit"
          className="w-full mb-3 bg-[#94BFA7] text-white py-2 rounded hover:opacity-90"
        >
          Login
        </button>
        <Link to="/signup">
        <button
          className="w-full bg-[#94BFA7] text-white py-2 rounded hover:opacity-90"
        >
          Signup
        </button></Link>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default CompanyLogin;
