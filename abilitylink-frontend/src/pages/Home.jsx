import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const email = userFromStorage?.email;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
              Welcome to AbilityLinks
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Connecting talented individuals with disabilities to inclusive
              employers who value diversity.
            </p>
            <div className="flex justify-center space-x-4">
              {!email ? (
                <>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/jobs"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition border border-blue-600"
                  >
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Our Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-3">
                  Personalized Job Matching
                </h3>
                <p className="text-gray-700">
                  AI-powered recommendations based on your skills and
                  accessibility needs.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">♿</div>
                <h3 className="text-xl font-bold mb-3">Disability-Focused</h3>
                <p className="text-gray-700">
                  Jobs categorized by disability type to find the perfect fit.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-3">Inclusive Community</h3>
                <p className="text-gray-700">
                  Connect with employers committed to accessibility and
                  inclusion.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
