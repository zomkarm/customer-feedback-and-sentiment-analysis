import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateSurveyForm = ({ survey, onSurveyCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("companyAuth"))?.token;

  useEffect(() => {
    if (survey) {
      setTitle(survey.title);
      setDescription(survey.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [survey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { title, description };

      if (survey) {
        // Edit
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/survey/${survey._id}`, payload, config);
      } else {
        // Create
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/survey/create`, payload, config);
      }

      onSurveyCreated();
    } catch (err) {
      console.error("Error submitting survey:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? "Saving..." : survey ? "Update Survey" : "Create Survey"}
      </button>
    </form>
  );
};

export default CreateSurveyForm;
