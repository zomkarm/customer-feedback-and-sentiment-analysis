import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("adminToken");
  const limit = 10; // Items per page

  const fetchCompanies = async (page = 1) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/company/all?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompanies(res.data.companies);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError("Failed to load companies.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompanyStatus = async (id) => {
    await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/toggle-company/${id}`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchCompanies(currentPage); // Refresh current page
  };

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">
        Manage Companies
      </h2>
      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Created At</th>
                  <th className="p-3">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {companies.map((company) => (
                  <tr
                    key={company._id}
                    className="hover:bg-green-50 dark:hover:bg-green-900"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{company.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm ${
                          company.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {company.isActive ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleCompanyStatus(company._id)}
                        className={`px-3 py-1 rounded text-white ${
                          company.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {company.isActive ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="text-green-700 dark:text-green-300 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCompanies;
