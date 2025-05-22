import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateSurveyForm from "../../components/form/CreateSurveyForm";

const SurveyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSurvey, setEditSurvey] = useState(null);
  const [viewSurvey, setViewSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Items per page

  const token = JSON.parse(localStorage.getItem("companyAuth"))?.token;

  const fetchSurveys = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/survey/list?page=${page}&limit=${pageSize}&isPaginated=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.surveys || []);
      setTotalPages(res.data.pages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to load surveys.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys(currentPage);
  }, []);

  const handleSurveyCreated = () => {
    setIsModalOpen(false);
    setEditSurvey(null);
    fetchSurveys(currentPage);
  };

  const handleEdit = (id) => {
    const project = projects.find((p) => p._id === id);
    setEditSurvey(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/survey/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSurveys(currentPage);
    } catch (err) {
      console.error("Error deleting survey:", err);
    }
  };

  const handleView = (survey) => {
    setViewSurvey(survey);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchSurveys(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
          Survey Projects
        </h2>
        <button
          onClick={() => {
            setEditSurvey(null);
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow p-4">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  <th className="border px-4 py-2 text-left">Title</th>
                  <th className="border px-4 py-2 text-left">Created At</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-green-50 dark:hover:bg-green-900">
                    <td className="border px-4 py-2">{project.title}</td>
                    <td className="border px-4 py-2">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button onClick={() => handleView(project)} className="text-green-600 hover:underline">
                        View
                      </button>
                      <button onClick={() => handleEdit(project._id)} className="text-blue-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center p-4 text-gray-500 dark:text-gray-400">
                      No survey projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-green-500 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
              {editSurvey ? "Edit Survey" : "Create New Survey"}
            </h3>
            <CreateSurveyForm survey={editSurvey} onSurveyCreated={handleSurveyCreated} />
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setViewSurvey(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
              Survey Details
            </h3>
            <p><strong>Title:</strong> {viewSurvey.title}</p>
            <p><strong>Description:</strong> {viewSurvey.description}</p>
            <p className="break-words">
              <strong>URL:</strong>{" "}
              <code className="text-sm break-all">
                {viewSurvey.feedbackUrl}
              </code>
            </p>
            <p><strong>Created At:</strong> {new Date(viewSurvey.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyProjects;
