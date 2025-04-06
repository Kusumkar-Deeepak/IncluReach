import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    remote: false,
    description: "",
    requirements: [""],
    skills: [""],
    disabilityTypes: [],
    disabilitySeverity: "Any",
    salary: {
      amount: "",
      currency: "USD",
      period: "month",
      isPublic: true,
    },
  });
  const [currentReq, setCurrentReq] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddItem = (field, value, setValue) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    setValue("");
  };

  const handleRemoveItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((i) => i !== item),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerificationResult(null);

    try {
      const response = await api.post("/jobs", formData);

      if (response.data.success) {
        if (response.data.job.status === "active") {
          toast.success("Job posted successfully!");
          navigate("/jobs");
        } else {
          toast.error("Job rejected. Enter Correct Data.");
          navigate("/jobs/new");
        }
      } else {
        setVerificationResult(response.data.details);
        toast.error("Job rejected - suspicious content detected");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Post a New Job
        </h1>

        {verificationResult && !verificationResult.isValid && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Job Rejected
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {verificationResult.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {verificationResult?.isValid && verificationResult.riskScore > 70 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Verification Warning (Risk score:{" "}
                  {verificationResult.riskScore})
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Your job posting was accepted but flagged for review:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    {verificationResult.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Job Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Name*
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Location*
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remote"
                name="remote"
                checked={formData.remote}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remote" className="ml-2 block text-gray-700">
                Remote position available
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Salary Amount
                </label>
                <input
                  type="number"
                  name="salary.amount"
                  value={formData.salary.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salary: {
                        ...prev.salary,
                        amount: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Currency
                </label>
                <select
                  name="salary.currency"
                  value={formData.salary.currency}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salary: {
                        ...prev.salary,
                        currency: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Period
                </label>
                <select
                  name="salary.period"
                  value={formData.salary.period}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salary: {
                        ...prev.salary,
                        period: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hour">Per hour</option>
                  <option value="day">Per day</option>
                  <option value="week">Per week</option>
                  <option value="month">Per month</option>
                  <option value="year">Per year</option>
                </select>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="salaryVisibility"
                checked={formData.salary.isPublic}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salary: {
                      ...prev.salary,
                      isPublic: e.target.checked,
                    },
                  }))
                }
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="salaryVisibility"
                className="ml-2 block text-gray-700"
              >
                Show salary publicly
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Job Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Requirements*
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={currentReq}
                  onChange={(e) => setCurrentReq(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a requirement"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddItem("requirements", currentReq, setCurrentReq)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.requirements?.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span>{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("requirements", req)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Required Skills*
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddItem("skills", currentSkill, setCurrentSkill)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((skill, i) => (
                  <div
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("skills", skill)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Suitable for Disability Types*
              </label>
              <div className="space-y-2">
                {["Physical", "Visual", "Hearing", "Cognitive", "Other"].map(
                  (type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.disabilityTypes.includes(type)}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            disabilityTypes: prev.disabilityTypes.includes(type)
                              ? prev.disabilityTypes.filter((t) => t !== type)
                              : [...prev.disabilityTypes, type],
                          }));
                        }}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">{type}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Suitable for Disability Severity*
              </label>
              <select
                name="disabilitySeverity"
                value={formData.disabilitySeverity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Any">Any severity</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Verifying..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateJob;
