import React, { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import ManageCompanies from "./ManageCompanies"

const AdminDashboard = ({ onLogout, adminInfo }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
  }, [darkMode]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const sentimentData = [
    { name: "Positive", value: 50 },
    { name: "Neutral", value: 30 },
    { name: "Negative", value: 20 },
  ];

  const volumeData = [
    { date: "May 01", feedbacks: 5 },
    { date: "May 02", feedbacks: 12 },
    { date: "May 03", feedbacks: 8 },
    { date: "May 04", feedbacks: 20 },
    { date: "May 05", feedbacks: 15 },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "Manage Companies":
        return <ManageCompanies />;
      case "Dashboard":
      default:
        return (
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Sentiment Pie Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">Sentiment Analysis</h3>
              <PieChart width={300} height={250}>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* Feedback Volume Bar Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">Feedback Volume</h3>
              <BarChart width={400} height={250} data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="feedbacks" fill="#00C49F" />
              </BarChart>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:relative z-30 w-64 h-screen bg-gradient-to-b from-green-600 to-green-800 text-white p-6 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-extrabold mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          {["Dashboard", "Manage Companies", "Reports", "Settings"].map((item) => (
            <button
              key={item}
              className={`text-left px-4 py-2 rounded ${
                activePage === item
                  ? "bg-white text-green-800 font-bold"
                  : "hover:bg-green-700"
              }`}
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <button
            ref={toggleButtonRef}
            className="md:hidden p-3 rounded-md bg-green-600 text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
            Welcome, {adminInfo?.name || "Admin"}
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle dark mode"
              className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={onLogout} className="text-red-500 font-semibold hover:text-red-700">
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        {renderPage()}
      </main>
    </div>
  );
};

export default AdminDashboard;
