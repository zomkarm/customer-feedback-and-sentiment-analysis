import React, { useState } from "react";
import CreateSurveyForm from "../../components/form/CreateSurveyForm"; // adjust path if needed

const SurveyProjects = () => {
  const [projects, setProjects] = useState([
    { id: 1, title: "Customer Satisfaction Q1", createdAt: "2025-05-20" },
    { id: 2, title: "Product Feedback April", createdAt: "2025-05-18" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
          Survey Projects
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Create
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow p-4">
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
              <tr key={project.id} className="hover:bg-green-50 dark:hover:bg-green-900">
                <td className="border px-4 py-2">{project.title}</td>
                <td className="border px-4 py-2">{project.createdAt}</td>
                <td className="border px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
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
      </div>

      {/* Modal */}
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
              Create New Survey
            </h3>
            <CreateSurveyForm onSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyProjects;
