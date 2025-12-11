import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const CompanySignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/company/signup`, formData);

      // Save token and company info
      localStorage.setItem("companyToken", res.data.token);
      localStorage.setItem("companyInfo", JSON.stringify(res.data.company));

      navigate("/login", {
        state: {
          message: "Signup successful! Please log in.",
          success: true
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Company Signup
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Company Name"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
          />

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
          Sign Up
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Log in
          </Link>
        </p>

        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
      </form>
    </div>

  );
};

export default CompanySignup;
