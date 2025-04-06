import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Make sure this line exists
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs");
        setJobs(data);
      } catch (err) {
        // Changed variable name from 'error' to 'err' to avoid confusion
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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

  if (loading) return <div className="text-center py-8">Loading jobs...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (jobs.length === 0)
    return <div className="text-center py-8">No jobs found</div>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
          {user && (
            <Link
              to="/jobs/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Post a Job
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg p-6 hover:shadow-md transition flex flex-col h-full"
            >
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {job.company} • {job.location}
                  {job.remote && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Remote
                    </span>
                  )}
                </p>

                {job.salary?.isPublic && job.salary?.amount && (
                  <div className="mt-2">
                    <span className="font-medium text-gray-800">
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills?.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-700 line-clamp-3">
                    {job.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Link
                  to={`/jobs/${job._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </Link>
                <span className="text-sm text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobsList;
