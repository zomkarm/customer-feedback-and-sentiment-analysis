import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from "recharts";

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

const COLORS = ["#22c55e", "#facc15", "#ef4444"]; // Tailwind green, yellow, red shades

const CompanyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [company, setCompany] = useState(null);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Load and verify auth
  useEffect(() => {
    const storedData = localStorage.getItem("companyAuth");
    if (!storedData) {
      navigate("/login"); // redirect if not logged in
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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("companyAuth");
    navigate("/login");
  };

  // Load dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update dark mode class & localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Close sidebar on Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
        toggleButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  // Trap focus inside sidebar when open
  useEffect(() => {
    if (!sidebarOpen) return;

    const focusableElements = sidebarRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select'
    );
    const firstElem = focusableElements[0];
    const lastElem = focusableElements[focusableElements.length - 1];

    function handleTab(e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElem) {
          e.preventDefault();
          lastElem.focus();
        }
      } else {
        if (document.activeElement === lastElem) {
          e.preventDefault();
          firstElem.focus();
        }
      }
    }

    document.addEventListener("keydown", handleTab);
    firstElem.focus();

    return () => document.removeEventListener("keydown", handleTab);
  }, [sidebarOpen]);

  return (
    <div className="flex dark min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-500">
      {/* Sidebar overlay with blur and fade */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-20 md:hidden
          ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        role="navigation"
        aria-label="Main sidebar navigation"
        aria-hidden={!sidebarOpen && window.innerWidth < 768}
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen w-64
          bg-gradient-to-b from-green-600 to-green-800 text-white shadow-lg p-6
          dark:from-gray-800 dark:to-gray-900
          transform transition-transform duration-300 ease-in-out
          z-30
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex md:flex-col md:w-64
          select-none
        `}
      >
        <h2 className="text-2xl font-extrabold mb-8 tracking-wide">Company Dashboard</h2>
        <nav className="flex flex-col gap-5 text-lg font-semibold">
          {["Overview", "Feedback", "Analytics", "Embedded Form", "Settings"].map((item) => (
            <a
              href="#"
              key={item}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 md:p-10">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          {/* Hamburger for mobile */}
          <button
            ref={toggleButtonRef}
            className="md:hidden p-3 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 shadow-lg transition-colors duration-300 dark:bg-green-700 dark:hover:bg-green-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
          >
            <svg
              className="w-6 h-6 transition-transform duration-200"
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

          <h1 className="text-3xl font-extrabold tracking-tight text-green-800 dark:text-green-400">
            Welcome, {company?.companyName || "Company"}
          </h1>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
              className="focus:outline-none focus:ring-2 focus:ring-green-500 p-2 rounded-full transition-colors duration-300
                bg-gray-200 text-yellow-500 dark:bg-gray-700 dark:text-yellow-300"
            >
              {darkMode ? (
                // Sun Icon for light mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m14.142 6.364l-.707-.707M6.364 6.364l-.707-.707m12.728 0l-.707.707M6.364 17.636l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z"
                  />
                </svg>
              ) : (
                // Moon Icon for dark mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="none"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            <button onClick={handleLogout}
              className="text-green-700 font-semibold hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-200 dark:text-red-400 dark:hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Responsive grid */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 dark:shadow-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
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
            <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
              Feedback Volume (Last 5 Days)
            </h3>
            <BarChart width={320} height={280} data={barData}>
              <XAxis dataKey="name" stroke="#16a34a" />
              <YAxis stroke="#16a34a" />
              <Tooltip />
              <Legend />
              <Bar dataKey="feedbacks" fill="#22c55e" />
            </BarChart>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2 hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 dark:shadow-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
              Embedded Form URL
            </h3>
            <code className="text-sm text-gray-600 dark:text-gray-300 select-all block p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 break-words">
              https://yourdomain.com/feedback/123456
            </code>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompanyDashboard;
