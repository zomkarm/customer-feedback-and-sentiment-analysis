import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const categories = ["Product", "Website", "Customer Support", "Delivery", "Pricing", "UX"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Visualization = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    averageRating: "0.00",
    sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
    totalFeedbacks: 0,
    trendData: [],
    categoryCounts: [],
    topKeywords: [],
  });

  const companyAuth = JSON.parse(localStorage.getItem("companyAuth"));
  const token = companyAuth?.token;
  
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/survey/list?isPaginated=false", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSurveys(res.data);
      } catch (err) {
        setError("Failed to load surveys");
      }
    };
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (!selectedSurvey) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:5000/api/visualization", {
          params: {
            surveyId: selectedSurvey,
            category: selectedCategory || undefined,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        setError("Failed to load visualization data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSurvey, selectedCategory]);

  const sentimentData = [
    { name: "Positive", value: data.sentimentCounts?.positive || 0 },
    { name: "Neutral", value: data.sentimentCounts?.neutral || 0 },
    { name: "Negative", value: data.sentimentCounts?.negative || 0 },
  ];

  const exportAsPDF = () => {
    const input = document.getElementById("visualization-charts");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("visualization.pdf");
    });
  };
  
  const exportAsImage = () => {
    const input = document.getElementById("visualization-charts");
    html2canvas(input).then((canvas) => {
      const link = document.createElement("a");
      link.download = "visualization.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };
  
  const exportAsCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Average Rating", data.averageRating],
      ["Total Feedbacks", data.totalFeedbacks],
      ["Positive", data.sentimentCounts.positive],
      ["Neutral", data.sentimentCounts.neutral],
      ["Negative", data.sentimentCounts.negative],
    ];
  
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "visualization.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Feedback Visualization</h1>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          value={selectedSurvey}
          onChange={(e) => setSelectedSurvey(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Survey</option>
          {surveys.map((survey) => (
            <option key={survey._id} value={survey._id}>
              {survey.title}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : selectedSurvey ? (
        <>
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Average Rating: {data.averageRating} / 5</h2>
            <p>Total Feedbacks: {data.totalFeedbacks}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportAsPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Export PDF
            </button>
            <button onClick={exportAsImage} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Export Image
            </button>
            <button onClick={exportAsCSV} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Export CSV
            </button>
          </div>
        </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Average Rating: {data.averageRating} / 5</h2>
            <p>Total Feedbacks: {data.totalFeedbacks}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-20">
            {/* Sentiment Distribution Pie */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-center">Sentiment Distribution</h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </div>

            {/* Sentiment Count Bar */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-center">Sentiment Counts</h3>
              <BarChart width={300} height={300} data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </div>

            {/* Rating Trend Line Chart */}
            {data?.trendData?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-center">Average Rating Over Time</h3>
                <LineChart width={300} height={300} data={data.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgRating" stroke="#ff7300" />
                </LineChart>
              </div>
            )}

            {/* Category-wise Feedback Count */}
            {data?.categoryCounts?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-center">Feedbacks by Category</h3>
                <BarChart width={300} height={300} data={data.categoryCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </div>
            )}

            {/* Top Keywords */}
            {data?.topKeywords?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-center">Top Keywords</h3>
                <BarChart width={300} height={300} data={data.topKeywords}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="word" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ffc658" />
                </BarChart>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-center">Please select a survey to view visualization.</p>
      )}
    </div>
  );
};

export default Visualization;
