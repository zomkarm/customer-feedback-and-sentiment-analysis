import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from "recharts";
import SurveyProjects from "./SurveyProjects";
import Feedbacks from "./Feedbacks";
import Visualization from "./Visualizations";

// Theme configuration
const theme = {
  primary: "#484848",
  primaryDark: "#3a3a3a",
  textOnPrimary: "#ffffff",
  accent: "#22c55e",
  warning: "#facc15",
  danger: "#ef4444",
};

const pieData = [
  { name: "Positive", value: 400 },
  { name: "Neutral", value: 300 },
  { name: "Negative", value: 300 },
];

const barData = [
  { name: "Mon", feedbacks: 30 },
  { name: "Tue", feedbacks: 45 },
  { name: "Wed", feedbacks: 50 },
  { name: "Thu", feedbacks: 40 },
  { name: "Fri", feedbacks: 60 },
];

const COLORS = [theme.accent, theme.warning, theme.danger];

const CompanyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [company, setCompany] = useState(null);
  const [activePage, setActivePage] = useState("Overview");

  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    const storedData = localStorage.getItem("companyAuth");
    if (!storedData) {
      navigate("/login");
    } else {
      try {
        const parsed = JSON.parse(storedData);
        setCompany(parsed);
      } catch (err) {
        console.error("Auth parsing error", err);
        localStorage.removeItem("companyAuth");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("companyAuth");
    navigate("/login");
  };

  const navItems = [
    "Overview",
    "Survey Projects",
    "Feedback",
    "Analytics",
    "Settings",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-500">
      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-20 md:hidden
          ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={{ backgroundColor: theme.primary }}
        className={`fixed top-0 left-0 min-h-screen w-64 text-white shadow-lg p-6 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:flex md:flex-col md:w-64 select-none`}
      >
        <h2 className="text-2xl font-extrabold mb-8 tracking-wide">Company Dashboard</h2>
        <nav className="flex flex-col gap-5 text-lg font-semibold">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActivePage(item);
                setSidebarOpen(false);
              }}
              style={{
                backgroundColor: activePage === item ? theme.primaryDark : undefined,
                color: activePage === item ? theme.textOnPrimary : "#d1d5db",
              }}
              className={`block px-4 py-2 text-sm rounded transition-colors duration-300 w-full text-left hover:opacity-80`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-6 md:p-10 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            ref={toggleButtonRef}
            className="md:hidden p-3 rounded-md text-white"
            style={{ backgroundColor: theme.primary }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: theme.primary }}>
            Welcome, {company?.companyName || "Company"}
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="focus:outline-none p-2 rounded-full bg-gray-200 text-yellow-500 dark:bg-gray-700 dark:text-yellow-300"
            >
              {darkMode ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m14.142 6.364l-.707-.707M6.364 6.364l-.707-.707m12.728 0l-.707.707M6.364 17.636l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="font-semibold transition-colors duration-200"
              style={{ color: "red" }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Overview Page */}
        {activePage === "Overview" && (
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 dark:shadow-gray-700">
              <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>
                Sentiment Breakdown
              </h3>
              <PieChart width={320} height={280}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 dark:shadow-gray-700">
              <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>
                Feedback Volume (Last 5 Days)
              </h3>
              <BarChart width={320} height={280} data={barData}>
                <XAxis dataKey="name" stroke={theme.primary} />
                <YAxis stroke={theme.primary} />
                <Tooltip />
                <Legend />
                <Bar dataKey="feedbacks" fill={theme.accent} />
              </BarChart>
            </div>
          </section>
        )}

        {activePage === "Survey Projects" && <SurveyProjects />}
        {activePage === "Feedback" && <Feedbacks />}
        {activePage === "Analytics" && <Visualization />}
      </main>
    </div>
  );
};

export default CompanyDashboard;
