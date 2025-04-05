import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get("/dashboard/applications");

        // Filter out null jobs and only show applications where user has applied
        const appliedJobs = data.filter((app) => app.job !== null);

        setApplications(appliedJobs);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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
            My Job Applications
          </h1>
          <p className="text-gray-600">Jobs you've applied to</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">
              You haven't applied to any jobs yet
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
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition"
              >
                <Link
                  to={`/jobs/${application.job._id}`}
                  className="block p-6 h-full"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {application.job.title}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {application.job.company} • {application.job.location}
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {application.job.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    Applied on{" "}
                    {new Date(application.appliedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Applications;
