import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [loadingApplicant, setLoadingApplicant] = useState(false);
  const [applicantError, setApplicantError] = useState(null);
  const [closingJobId, setClosingJobId] = useState(null);
  const [closeError, setCloseError] = useState(null);
  const [closeConfirmationOpen, setCloseConfirmationOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState({
    jobId: null,
    applicantId: null,
  });

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/jobs/my-jobs");

        // Validate response structure
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from server");
        }

        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch jobs. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const handleAcceptApplicant = async () => {
    try {
      setAccepting(true);
      const { jobId, applicantId } = currentSelection;

      if (!jobId || !applicantId) {
        throw new Error("Missing jobId or applicantId");
      }

      const { data } = await api.put(`/jobs/${jobId}/accept`, {
        applicantId,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to accept applicant");
      }

      // Update local state
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job._id === jobId) {
            // Find the applicant
            const applicant = job.applicants.find(
              (app) => app.user._id === applicantId
            );

            // Filter out the accepted applicant
            const remainingApplicants = job.applicants.filter(
              (app) => app.user._id !== applicantId
            );

            return {
              ...job,
              applicants: remainingApplicants,
              acceptedApplicants: [
                ...(job.acceptedApplicants || []),
                {
                  user: applicant.user,
                  acceptedAt: new Date().toISOString(),
                },
              ],
            };
          }
          return job;
        })
      );

      setConfirmationOpen(false);
    } catch (err) {
      console.error("Error accepting applicant:", err);
      setError(
        err.response?.data?.message ||
          "Failed to accept applicant. Please try again."
      );
    } finally {
      setAccepting(false);
    }
  };

  const handleViewApplicant = async (applicantId) => {
    try {
      // Validate applicantId before making the request
      if (
        !applicantId ||
        typeof applicantId !== "string" ||
        applicantId.length < 10
      ) {
        throw new Error("Invalid applicant ID format");
      }

      setLoadingApplicant(true);
      setApplicantError(null);
      setCurrentSelection((prev) => ({ ...prev, applicantId }));

      const { data } = await api.get(`/jobs/applicants/${applicantId}`);

      // More thorough response validation
      if (!data || !data.success || !data.applicant || !data.applicant._id) {
        throw new Error(data?.message || "Invalid applicant data received");
      }

      setSelectedApplicant(data.applicant);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching applicant details:", err);
      setApplicantError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load applicant details. Please try again."
      );
    } finally {
      setLoadingApplicant(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleAcceptConfirmation = (jobId, applicantId) => {
    setCurrentSelection({ jobId, applicantId });
    setConfirmationOpen(true);
  };

  const handleCloseJob = async () => {
    try {
      if (!currentSelection.jobId) {
        throw new Error("No job selected");
      }

      setClosingJobId(currentSelection.jobId);
      setCloseError(null);

      const { data } = await api.put(`/jobs/${currentSelection.jobId}/close`);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to close job");
      }

      // Optimistic UI update
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === currentSelection.jobId
            ? { ...job, status: "closed" }
            : job
        )
      );

      // Reset state
      setCloseConfirmationOpen(false);
      setCurrentSelection({ jobId: null, applicantId: null });
    } catch (err) {
      console.error("Error closing job:", err);
      setCloseError(
        err.response?.data?.message ||
          err.message ||
          "Failed to close job. Please try again."
      );
    } finally {
      setClosingJobId(null);
    }
  };

  const handleCloseConfirmation = (jobId) => {
    // Close other modals first
    setConfirmationOpen(false);
    setIsModalOpen(false);

    setCloseError(null);
    setCurrentSelection((prev) => ({ ...prev, jobId }));
    setCloseConfirmationOpen(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">Loading...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Close Job Confirmation Modal */}
      {closeConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Close Job Posting</h2>
              <p>Are you sure you want to close this job posting? This will:</p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                <li>Prevent new applicants from applying</li>
                <li>Keep the job visible for reference</li>
                <li>Allow you to reopen it later if needed</li>
              </ul>
              {closeError && (
                <div className="mt-3 text-red-500 text-sm">{closeError}</div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setCloseConfirmationOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseJob}
                disabled={!!closingJobId}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                  closingJobId ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {closingJobId ? "Closing..." : "Confirm Close"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {/* Confirmation Modal */}
        {confirmationOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Confirm Selection</h2>
                <p>
                  Are you sure you want to select this applicant for the job?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                <button
                  onClick={() => setConfirmationOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptApplicant}
                  disabled={accepting}
                  className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                    accepting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {accepting ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applicant Details Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {loadingApplicant ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">
                      Loading applicant details...
                    </p>
                  </div>
                ) : applicantError ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="font-medium">Error loading details</p>
                    <p className="mt-1">{applicantError}</p>
                    <button
                      onClick={() =>
                        handleViewApplicant(currentSelection.applicantId)
                      }
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Retry
                    </button>
                  </div>
                ) : selectedApplicant ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      {/* Profile Image */}
                      <div className="flex items-center gap-4">
                        {selectedApplicant.profile?.profileImage ? (
                          <img
                            src={`/uploads/${selectedApplicant.profile.profileImage.replace(
                              "public/uploads/",
                              ""
                            )}`}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                              // Fallback to UI Avatar if image fails to load
                              const name = selectedApplicant.fullName.replace(
                                /\s+/g,
                                "+"
                              );
                              e.target.src = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=64`;
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                selectedApplicant.fullName
                              )}&background=random&color=fff&size=64`}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h2 className="text-2xl font-bold">
                          {selectedApplicant.fullName}'s Profile
                        </h2>
                      </div>
                      <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Contact Information
                        </h3>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{selectedApplicant.email || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Preferred Contact Methods
                          </p>
                          <p>
                            {selectedApplicant.profile?.preferredContactMethods?.join(
                              ", "
                            ) || "Not specified"}
                          </p>
                        </div>
                      </div>

                      {/* Professional Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Professional Details
                        </h3>
                        <div>
                          <p className="text-sm text-gray-500">Profession</p>
                          <p>
                            {selectedApplicant.profile?.professionType ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Experience Level
                          </p>
                          <p>
                            {selectedApplicant.profile?.experienceLevel ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Education Level
                          </p>
                          <p>
                            {selectedApplicant.profile?.educationLevel ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Skills
                        </h3>
                        {selectedApplicant.profile?.skills?.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedApplicant.profile.skills.map(
                              (skill, index) => (
                                <span
                                  key={`skill-${index}`}
                                  className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500">No skills listed</p>
                        )}
                      </div>

                      {/* Disability Information */}
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Disability Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Disability Type
                            </p>
                            <p>
                              {selectedApplicant.profile?.disabilityType ||
                                "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Severity</p>
                            <p>
                              {selectedApplicant.profile?.disabilitySeverity ||
                                "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p>
                              {selectedApplicant.profile
                                ?.disabilityDescription ||
                                "No description provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Needs Accommodation
                            </p>
                            <p>
                              {selectedApplicant.profile?.needsAccommodation
                                ? "Yes"
                                : "No"}
                            </p>
                          </div>
                          {selectedApplicant.profile?.needsAccommodation && (
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-500">
                                Accommodation Requirements
                              </p>
                              <p>
                                {selectedApplicant.profile?.accommodationRequirements?.join(
                                  ", "
                                ) || "No specific requirements provided"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Accessibility Preferences */}
                      <div className="md:col-span-2 space-y-2">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Accessibility Preferences
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Requires Sign Language
                            </p>
                            <p>
                              {selectedApplicant.profile?.requiresSignLanguage
                                ? "Yes"
                                : "No"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Requires Captioning
                            </p>
                            <p>
                              {selectedApplicant.profile?.requiresCaptioning
                                ? "Yes"
                                : "No"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Requires Alt Text
                            </p>
                            <p>
                              {selectedApplicant.profile?.requiresAltText
                                ? "Yes"
                                : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Resume and Certifications */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Resume
                        </h3>
                        {selectedApplicant.profile?.resumeFile ? (
                          <div className="mb-4">
                            <a
                              href={`/${selectedApplicant.profile.resumeFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Download Resume
                            </a>
                            <p className="text-xs text-gray-500 mt-1">
                              {selectedApplicant.profile.resumeFile
                                .split("/")
                                .pop()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 mb-4">
                            No resume uploaded
                          </p>
                        )}

                        <h3 className="text-lg font-semibold border-b pb-2 mt-6">
                          Certifications
                        </h3>
                        {selectedApplicant.profile?.certificationFiles?.length >
                        0 ? (
                          <div className="space-y-2">
                            {selectedApplicant.profile.certificationFiles.map(
                              (file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <a
                                    href={`/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {file.split("/").pop()}
                                  </a>
                                  <span className="text-xs text-gray-500">
                                    (Certification {index + 1})
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            No certifications uploaded
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Posted Jobs</h1>
          <Link
            to="/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven't posted any jobs yet.
            </p>
            <Link
              to="/jobs/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={`job-${job._id}`} className="mb-8 border-b pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-600">
                    {job.company} • {job.location}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      job.status === "active"
                        ? "bg-green-100 text-green-800"
                        : job.status === "closed"
                        ? "bg-gray-200 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  {job.status === "active" && (
                    <button
                      onClick={() => handleCloseConfirmation(job._id)}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Close Job
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium">Selected Applicants:</h3>
                {job.acceptedApplicants?.length > 0 ? (
                  <ul className="mt-2 space-y-3">
                    {job.acceptedApplicants.map((applicant) => {
                      // Check if user data exists
                      if (!applicant.user) {
                        console.warn(
                          "Accepted applicant missing user data:",
                          applicant
                        );
                        return null;
                      }

                      return (
                        <li
                          key={`selected-applicant-${applicant.user._id}`}
                          className="p-3 bg-green-50 rounded border border-green-100"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-green-800">
                                {applicant.user.fullName || "Unknown Applicant"}
                              </p>
                              <p className="text-sm text-green-600">
                                {applicant.user.email || "No email provided"}
                              </p>
                            </div>
                            <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded">
                              Selected
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 mt-2">
                    No applicants selected yet
                  </p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-medium">Applicants:</h3>
                {job.applicants?.filter(
                  (applicant) =>
                    !job.acceptedApplicants?.some(
                      (accApp) =>
                        accApp.user._id.toString() ===
                        applicant.user._id.toString()
                    )
                ).length > 0 ? (
                  <ul className="mt-2 space-y-3">
                    {job.applicants
                      ?.filter(
                        (applicant) =>
                          !job.acceptedApplicants?.some(
                            (accApp) =>
                              accApp.user._id.toString() ===
                              applicant.user._id.toString()
                          )
                      )
                      .map((applicant) => {
                        if (!applicant?.user?._id) {
                          console.warn("Invalid applicant data:", applicant);
                          return null;
                        }

                        return (
                          <li
                            key={`applicant-${applicant.user._id}`}
                            className="flex flex-col md:flex-row md:justify-between md:items-center p-3 bg-gray-50 rounded"
                          >
                            <div className="mb-2 md:mb-0">
                              <p className="font-medium">
                                {applicant.user.fullName || "Unknown Applicant"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {applicant.user.email || "No email provided"}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleViewApplicant(applicant.user._id)
                                }
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                disabled={
                                  !applicant.user._id || loadingApplicant
                                }
                              >
                                {loadingApplicant &&
                                currentSelection.applicantId ===
                                  applicant.user._id ? (
                                  <span className="inline-flex items-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Loading...
                                  </span>
                                ) : (
                                  "View Details"
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleAcceptConfirmation(
                                    job._id,
                                    applicant.user._id
                                  )
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                disabled={!applicant.user._id}
                              >
                                Select
                              </button>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <p className="text-gray-500 mt-2">No applicants yet</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyJobs;
