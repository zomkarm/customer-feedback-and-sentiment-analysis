// LandingPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Button from "../../components/ui/Button";
import feedbackAnimation from "../../assets/animations/feedbackAnimation.json";
import statisticsAnimation from "../../assets/animations/statisticsAnimation.json";

const LandingPage = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  function handleSidebarToggle() {
    if (sidebarToggle === true) setSidebarToggle(false);
    else setSidebarToggle(true);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <header className="flex justify-between items-center p-6 shadow bg-gradient-to-r from-violet-500 to-violet-700 text-white">
        <h1 className="text-2xl font-bold">Customer Feedback Analysis</h1>
        <div className="desktop-nav hidden md:block">
          <Link to="/login" className="m-4">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-violet-700"
            >
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="hover:bg-white text-white-700 hover:bg-violet-100 px-4 py-2 rounded-md">
              Sign Up
            </Button>
          </Link>
        </div>
        <span
          onClick={handleSidebarToggle}
          className="md:hidden text-white-700 hover:bg-violet-100 border-2 px-4 py-2 rounded-md"
        >
          ☰
        </span>
      </header>

      <div
        className={`mobile-nav md:hidden ${
          sidebarToggle === false ? "hidden" : ""
        } fixed left-0 top-0 w-24 bg-blue-400 h-full w-2/6 z-50 transition ease-in-out deley-150 duration-300`}
      >
        <Link to="/login" className="block m-4">
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-violet-700"
          >
            Login
          </Button>
        </Link>
        <Link to="/signup"  className="block m-4">
          <Button  variant="outline" className="border-white text-white hover:bg-white hover:text-violet-700">
            Sign Up
          </Button>
        </Link>
      </div>

      {/* Animation + Info Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-16 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          {/* Lottie Animation */}
          <div className="w-full md:w-1/2">
            <Lottie
              animationData={feedbackAnimation}
              loop
              autoplay
              className="w-full h-64 md:h-80"
            />
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Collect. Analyze. Visualize.
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Our platform enables businesses to collect real-time feedback from
              customers, automatically analyze sentiment and suggestions, and
              visualize insights with interactive charts.
            </p>
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Make smarter decisions with data-driven feedback analysis.
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Centered Animation */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            See Emotions Turn Into Insights
          </h2>
          <Lottie
            animationData={statisticsAnimation}
            loop
            autoplay
            className="w-full max-w-md h-72 mx-auto"
          />
          <p className="text-lg text-gray-600 mt-6">
            Powered by real-time sentiment analysis, we help you track customer
            happiness, understand pain points, and improve continuously.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
