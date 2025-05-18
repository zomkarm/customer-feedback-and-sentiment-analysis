// LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <header className="flex justify-between items-center p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-blue-600">SentimentSense</h1>
        <div>
          <Link to="/login" className="mr-4">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-xl">
          <h2 className="text-4xl font-bold mb-4">Understand Your Customers Better</h2>
          <p className="mb-6 text-lg text-gray-700">
            Collect feedback and gain insights through sentiment analysis. Empower your business with real-time customer data.
          </p>
          <Link to="/signup">
            <Button className="text-lg px-6 py-3">Get Started</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
