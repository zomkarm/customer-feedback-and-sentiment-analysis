import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem('adminToken');


  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/company/all",{
          headers: { Authorization: `Bearer ${token}` },
        }); 
      setCompanies(res.data);
    } catch (err) {
      setError("Failed to load companies.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompanyStatus = async (id) => {
    const token = localStorage.getItem("adminToken");
    await axios.patch(`http://localhost:5000/api/admin/toggle-company/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCompanies(); // Refresh list
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Manage Companies</h2>
      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
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
                <tr key={company._id} className="hover:bg-green-50 dark:hover:bg-green-900">
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
      )}
    </div>
  );
};

export default ManageCompanies;
