// components/CreateSurveyForm.jsx
import React, { useState } from "react";
import axios from "axios";

const CreateSurveyForm = ({ onSurveyCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const companyAuth = JSON.parse(localStorage.getItem("companyAuth"));
      console.log(companyAuth);
      console.log("token----------"+companyAuth.token);
      const res = await axios.post(
        "http://localhost:5000/api/survey/create",
        { name, description },
        { headers: { Authorization: `Bearer ${companyAuth.token}` } }
      );

      setMessage("Survey project created!");
      setName("");
      setDescription("");
      onSurveyCreated && onSurveyCreated(res.data.survey);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating survey.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-bold">Create Survey Project</h2>

      <input
        type="text"
        placeholder="Survey Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Creating..." : "Create Survey"}
      </button>

      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </form>
  );
};

export default CreateSurveyForm;
