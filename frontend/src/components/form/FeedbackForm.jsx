import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FeedbackForm = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    category: "", 
    comment: "",
    suggestion: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/survey/${surveyId}`);
        setSurvey(res.data);
      } catch (err) {
        console.error(err);
        setError("Survey not found.");
      }
    };

    fetchSurvey();
  }, [surveyId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/feedback/${surveyId}`, {
        ...formData,
        surveyId,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Server Error / Feedback already submitted.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
          <p className="text-gray-600">Your feedback has been submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
              {survey?.title || "Loading..."}
            </h2>
            <p className="text-gray-500 text-center mb-6">{survey?.description}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <select
                name="rating"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.rating}
                onChange={handleChange}
                required
              >
                <option value="">Rate Your Experience</option>
                <option value="1">1 - Very Bad</option>
                <option value="2">2 - Bad</option>
                <option value="3">3 - Neutral</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
              <select
                name="category"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Feedback Category</option>
                <option value="Product">Product</option>
                <option value="Delivery">Delivery</option>
                <option value="Pricing">Pricing</option>
                <option value="Website">Website</option>
                <option value="UX">UX</option>
                <option value="Customer Support">Support</option>
              </select>

              <textarea
                name="comment"
                rows="4"
                placeholder="What did you like or dislike?"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.comment}
                onChange={handleChange}
              ></textarea>
              <textarea
                name="suggestion"
                rows="3"
                placeholder="Suggestions for improvement (optional)"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.suggestion}
                onChange={handleChange}
              ></textarea>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="recommend"
                  checked={formData.recommend}
                  onChange={(e) =>
                    setFormData({ ...formData, recommend: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span>Would you recommend us to others?</span>
              </label>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Submit Feedback
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
