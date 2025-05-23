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
      const res = await axios.post("http://localhost:5000/api/company/signup", formData);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Company Signup</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Company Name"
          required
          className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
        />

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

        <Button
          type="submit"
          className="w-full mb-3 bg-[#94BFA7] text-white py-2 rounded hover:opacity-90"
        >
          Signup
        </Button>

        <Link to='/login'>
        <Button
          className="w-full bg-[#94BFA7] text-white py-2 rounded hover:opacity-90">
          Login
        </Button></Link>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default CompanySignup;
