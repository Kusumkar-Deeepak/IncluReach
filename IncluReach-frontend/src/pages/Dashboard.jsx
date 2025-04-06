import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    profileCompletion: 0,
    applicationsCount: 0,
    selectedJobsCount: 0,
    activityLog: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [dashboardResponse, applicationsResponse, selectedJobsResponse] =
          await Promise.all([
            api.get("/dashboard"),
            api.get("/dashboard/applications"),
            api.get("/dashboard/selected-jobs"),
          ]);

        // Validate and normalize responses
        const dashboardData = dashboardResponse.data || {};
        const applicationsData = applicationsResponse.data || {};
        const selectedJobsData = selectedJobsResponse.data || {};

        // Ensure counts are numbers
        const applicationsCount = Number.isInteger(applicationsData.count)
          ? applicationsData.count
          : Array.isArray(applicationsData.applications)
          ? applicationsData.applications.length
          : 0;

        const selectedJobsCount = Number.isInteger(selectedJobsData.count)
          ? selectedJobsData.count
          : Array.isArray(selectedJobsData.jobs)
          ? selectedJobsData.jobs.length
          : 0;

        setDashboardData({
          profileCompletion: Number(dashboardData.profileCompletion) || 0,
          applicationsCount,
          selectedJobsCount,
          activityLog: Array.isArray(dashboardData.activityLog)
            ? dashboardData.activityLog
            : [],
        });
      } catch (err) {
        console.error("Dashboard error:", err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data";
        setError(errorMessage);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
            <p className="font-medium">Error Loading Dashboard</p>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
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
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.fullName || "User"}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-red-600 px-4 py-2 rounded-lg border border-red-600 hover:bg-red-50 transition whitespace-nowrap"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Completion Card */}
          <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
            <h3 className="text-gray-500 font-medium mb-2">
              Profile Completeness
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {dashboardData.profileCompletion}%
                </span>
              </div>
              <Link
                to="/profile/edit"
                className="text-blue-600 hover:underline text-sm"
              >
                {dashboardData.profileCompletion === 100
                  ? "View Profile"
                  : "Complete Profile"}
              </Link>
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
            <h3 className="text-gray-500 font-medium mb-2">My Applications</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {dashboardData.applicationsCount}
            </p>
            <Link
              to="/dashboard/applications"
              className="text-blue-600 hover:underline text-sm"
            >
              View applications
            </Link>
          </div>

          {/* Selected Jobs Card */}
          <div className="bg-white p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-gray-500 font-medium mb-2">Selected Jobs</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {dashboardData.selectedJobsCount}
            </p>
            <Link
              to="/dashboard/selected-jobs"
              className="text-blue-600 hover:underline text-sm"
            >
              View selected jobs
            </Link>
          </div>
        </div>

        {/* Recent Activity Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            {/* <Link
              to="/activity"
              className="text-blue-600 hover:underline text-sm"
            >
              View all activity
            </Link> */}
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {dashboardData.activityLog?.length > 0 ? (
              dashboardData.activityLog.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition flex items-start gap-4"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    {activity.type === "Application" ? (
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    ) : activity.type === "StatusChange" ? (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {activity.details}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recent activity to display
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/jobs"
              className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-blue-500 transition flex items-center gap-4"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Browse Jobs</h3>
                <p className="text-gray-500 text-sm">
                  Find your next opportunity
                </p>
              </div>
            </Link>
            <Link
              to="/profile/edit"
              className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-blue-500 transition flex items-center gap-4"
            >
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Update Profile</h3>
                <p className="text-gray-500 text-sm">
                  Improve your profile visibility
                </p>
              </div>
            </Link>
            <Link
              to="/jobs/my-jobs"
              className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-blue-500 transition flex items-center gap-4"
            >
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">My Posted Jobs</h3>
                <p className="text-gray-500 text-sm">Check your Posted Jobs</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
