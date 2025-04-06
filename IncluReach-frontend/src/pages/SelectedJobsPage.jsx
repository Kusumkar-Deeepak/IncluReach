import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const SelectedJobsPage = () => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Helper function to format salary
  const formatSalary = (salary) => {
    if (!salary?.amount || !salary.isPublic) return null;

    const currencySymbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
    };

    const periodText = {
      hour: "/hr",
      day: "/day",
      week: "/wk",
      month: "/mo",
      year: "/yr",
    };

    return `${currencySymbols[salary.currency] || salary.currency}${
      salary.amount
    }${periodText[salary.period] || ""}`;
  };

  useEffect(() => {
    const fetchSelectedJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/selected-jobs");
        console.log("Selected Jobs API Response:", response.data);

        if (response.data.success) {
          setSelectedJobs(response.data.data);
        } else {
          setError("Failed to load selected jobs");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.response?.data?.message || "Failed to fetch selected jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Your Selected Job Offers
          </h1>
          <p className="text-gray-600">
            Jobs where recruiters have selected you
          </p>
        </div>

        {selectedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">
              You haven't been selected for any jobs yet
            </p>
            <Link
              to="/jobs"
              className="text-blue-600 hover:underline font-medium"
            >
              Browse available jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {selectedJobs.map((jobApp) => {
              // Safely access jobId properties
              const job = jobApp.jobId || jobApp;
              const postedBy = job.postedBy || {};

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-green-500 hover:shadow-md transition"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        {job.title}
                      </h2>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Selected
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {job.company} • {job.location}
                      {job.remote && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Remote
                        </span>
                      )}
                    </p>
                    {/* Salary Display */}
                    {job.salary?.amount && job.salary?.isPublic && (
                      <div className="mb-3">
                        <span className="font-medium text-gray-800">
                          {formatSalary(job.salary)}
                        </span>
                        {job.salary.period === "hour" && (
                          <span className="text-sm text-gray-500 ml-1">
                            (estimated)
                          </span>
                        )}
                      </div>
                    )}
                    {postedBy.fullName && (
                      <p className="text-sm text-gray-500 mb-2">
                        Posted by: {postedBy.fullName}
                      </p>
                    )}
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-1">
                          Required Skills:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {job.disabilityTypes && job.disabilityTypes.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-1">
                          Disability Accommodations:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.disabilityTypes.map((type) => (
                            <span
                              key={type}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </Link>
                      <span className="text-sm text-gray-500">
                        Selected on{" "}
                        {new Date(
                          jobApp.updatedAt || jobApp.acceptedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SelectedJobsPage;
