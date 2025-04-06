import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch job data
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/jobs/${id}`);
        if (!data) throw new Error("Failed to load job details");
        setJob(data);
      } catch (err) {
        console.error("Error fetching job data:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load job details"
        );
        if (err.response?.status === 404) {
          navigate("/jobs", { replace: true });
          toast.error("Job not found");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id, navigate]);

  // Check application status
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user) {
        setApplied(false);
        return;
      }
      try {
        const { data } = await api.get(`/jobs/${id}/check-applied`);
        setApplied(data?.applied || false);
      } catch (err) {
        console.error("Error checking application status:", err);
      }
    };
    checkApplicationStatus();
  }, [id, user]);

  const handleApply = async () => {
    try {
      const { data } = await api.post(`/jobs/${id}/apply`);
      if (data.success) {
        setApplied(true);
        toast.success(data.message);
        if (user) {
          setJob((prev) => ({
            ...prev,
            applicants: [
              ...(prev.applicants || []),
              { user: user._id, appliedAt: data.appliedAt },
            ],
          }));
        }
      } else {
        toast.error(data.message || "Application failed");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to apply for job"
      );
    }
  };

  // Helper functions
  const isJobPosterOrRecruiter =
    user &&
    job?.postedBy &&
    (user._id === job.postedBy._id || user.role === "recruiter");

  const formatSalary = (salary) => {
    if (!salary?.amount || !salary.isPublic) return null;

    const currencySymbols = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };
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

  const getSalaryDetails = () => {
    if (!job?.salary?.amount || !job.salary.isPublic) return null;

    return (
      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Salary Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Amount</p>
            <p className="font-medium">
              {formatSalary(job.salary)}
              {job.salary.period === "hour" && (
                <span className="text-sm text-gray-500 ml-1">(estimated)</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Payment Frequency</p>
            <p className="font-medium capitalize">
              {job.salary.period === "hour"
                ? "Hourly"
                : job.salary.period === "day"
                ? "Daily"
                : job.salary.period === "week"
                ? "Weekly"
                : job.salary.period === "month"
                ? "Monthly"
                : "Yearly"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Currency</p>
            <p className="font-medium">{job.salary.currency}</p>
          </div>
          <div>
            <p className="text-gray-600">Visibility</p>
            <p className="font-medium">
              {job.salary.isPublic ? "Public" : "Private"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render states
  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Error Loading Job
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );

  if (!job)
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-700 mb-6">
            The job you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Available Jobs
          </Link>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <p className="text-xl text-gray-600">
                  {job.company} • {job.location}
                </p>
                {job.remote && (
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Remote Available
                  </span>
                )}
              </div>

              {/* Salary Preview */}
              {job.salary?.isPublic && job.salary?.amount && (
                <div className="mt-3 flex items-center">
                  <span className="text-xl font-semibold text-gray-800">
                    {formatSalary(job.salary)}
                  </span>
                  {job.salary.period === "hour" && (
                    <span className="text-sm text-gray-500 ml-2">
                      (estimated)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Application Button */}
            {user ? (
              isJobPosterOrRecruiter ? (
                <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                  {user._id === job.postedBy._id
                    ? "Your posted job"
                    : "Recruiters cannot apply"}
                </span>
              ) : applied ? (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                >
                  ✓ Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Apply Now
                </button>
              )
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Login to Apply
              </Link>
            )}
          </div>

          {/* Job Description */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>

          {/* Salary Details Section */}
          {getSalaryDetails()}

          {/* Requirements and Skills */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements?.length > 0 ? (
                  job.requirements.map((req, i) => (
                    <li key={i} className="text-gray-700">
                      {req}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No requirements specified</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Disability Considerations
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Types:</span>{" "}
                    {job.disabilityTypes.join(", ") || "None specified"}
                  </p>
                  <p>
                    <span className="font-medium">Severity:</span>{" "}
                    {job.disabilitySeverity || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Posted By */}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Posted By
                </h3>
                <p className="text-gray-700">
                  {job.postedBy?.fullName || "Unknown"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                to="/jobs"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobDetail;
