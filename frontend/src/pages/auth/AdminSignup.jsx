import React, { useState } from "react";
import axios from "axios";

const AdminSignup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/signup", formData);
      setSuccessMsg(res.data.message);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Admin Signup</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
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

        <button
          type="submit"
          className="w-full bg-[#94BFA7] text-white py-2 rounded hover:opacity-90"
        >
          Sign Up
        </button>

        {successMsg && <p className="text-green-600 mt-3">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 mt-3">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default AdminSignup;
