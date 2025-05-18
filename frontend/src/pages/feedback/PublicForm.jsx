import React from "react";
import { useParams } from "react-router-dom";

const PublicForm = () => {
  const { companyId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Feedback Form</h2>
        <p className="mb-4 text-sm text-gray-600 text-center">Company ID: {companyId}</p>
        <form>
          <textarea
            placeholder="Write your feedback here..."
            className="w-full h-32 p-3 border rounded mb-4"
          ></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;
