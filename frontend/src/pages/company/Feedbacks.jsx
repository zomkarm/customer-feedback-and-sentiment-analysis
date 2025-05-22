import React, { useEffect, useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [surveyProjects, setSurveyProjects] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const companyAuth = JSON.parse(localStorage.getItem("companyAuth"));
  const token = companyAuth?.token;

  // Separated for reuse
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
        params: selectedSurveyId ? { surveyId: selectedSurveyId } : {},
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    }
  };

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/survey/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSurveyProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch surveys", err);
      }
    };
    fetchSurveys();
  }, [token]);

  useEffect(() => {
    fetchFeedbacks();
  }, [token, selectedSurveyId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  const handleExportCSV = () => {
    const headers = ["Rating", "Category", "Comment", "Date"];
    const rows = feedbacks.map(fb => [
      fb.rating,
      fb.category,
      `"${fb.comment.replace(/"/g, '""')}"`, // Escape quotes
      new Date(fb.createdAt).toLocaleString()
    ]);
  
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "feedbacks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Feedbacks</h2>
        <div className="flex items-center space-x-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
            value={selectedSurveyId}
            onChange={(e) => setSelectedSurveyId(e.target.value)}
          >
            <option value="">All Projects</option>
            {surveyProjects.map((survey) => (
              <option key={survey._id} value={survey._id}>
                {survey.title}
              </option>
            ))}
          </select>
          <button
            onClick={fetchFeedbacks}
            title="Refresh"
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            🔄
          </button>
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
            📄
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Rating</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Comment</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-4">{fb.rating}</td>
                <td className="py-2 px-4">{fb.category}</td>
                <td className="py-2 px-4 truncate max-w-xs">{fb.comment}</td>
                <td className="py-2 px-4">{new Date(fb.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => openModal(fb)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(fb._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No feedbacks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">Feedback Details</h3>
            <p><strong>Rating:</strong> {selectedFeedback.rating}</p>
            <p><strong>Category:</strong> {selectedFeedback.category}</p>
            <p><strong>Comment:</strong> {selectedFeedback.comment}</p>
            <p><strong>Date:</strong> {new Date(selectedFeedback.createdAt).toLocaleString()}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
