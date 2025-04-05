import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { toast } from "react-toastify";

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    disabilityType: "",
    disabilitySeverity: "",
    disabilityDescription: "",
    needsAccommodation: false,
    accommodationRequirements: [],
    professionType: "",
    skills: [],
    experienceLevel: "",
    educationLevel: "",
    preferredContactMethods: [],
    requiresSignLanguage: false,
    requiresCaptioning: false,
    requiresAltText: false,
    resumeFile: "",
    portfolioFile: "",
    certificationFiles: [],
    profileImage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Fixed the state name

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentAccommodation, setCurrentAccommodation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // Add these state declarations at the top of your component
  const [fileUploads, setFileUploads] = useState({
    profileImage: null,
    resumeFile: null,
    certificationFiles: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/dashboard");
        if (data.user.profile) {
          setFormData({
            ...data.user.profile,
            accommodationRequirements:
              data.user.profile.accommodationRequirements || [],
            preferredContactMethods:
              data.user.profile.preferredContactMethods || [],
            certificationFiles: data.user.profile.certificationFiles || [],
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFormData((prev) => ({
      ...prev,
      [name]: selectedValues,
    }));
  };

  const handleAddItem = (field, currentValue, setCurrentValue) => {
    if (currentValue.trim() && !formData[field].includes(currentValue.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], currentValue.trim()],
      }));
      setCurrentValue("");
    }
  };

  const handleRemoveItem = (field, itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== itemToRemove),
    }));
  };

  const handleRemoveCertification = (index) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.certificationFiles];
      updatedFiles.splice(index, 1);
      return {
        ...prev,
        certificationFiles: updatedFiles,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all non-file fields
      for (const [key, value] of Object.entries(formData)) {
        if (
          key !== "profileImage" &&
          key !== "resumeFile" &&
          key !== "certificationFiles"
        ) {
          if (Array.isArray(value)) {
            value.forEach((item) => formDataToSend.append(key, item));
          } else if (value !== null && value !== undefined) {
            formDataToSend.append(key, value);
          }
        }
      }

      // Append files
      if (fileUploads.profileImage) {
        formDataToSend.append("profileImage", fileUploads.profileImage);
      }
      if (fileUploads.resumeFile) {
        formDataToSend.append("resumeFile", fileUploads.resumeFile);
      }
      fileUploads.certificationFiles.forEach((file) => {
        formDataToSend.append("certificationFiles", file);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await api.put("/profile", formDataToSend, config);
      toast.success("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, ...data.profile }));
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update your file input handling
  const handleFileChange = (e, fieldName) => {
    if (fieldName === "certificationFiles") {
      setFileUploads((prev) => ({
        ...prev,
        certificationFiles: Array.from(e.target.files),
      }));
    } else {
      setFileUploads((prev) => ({
        ...prev,
        [fieldName]: e.target.files[0],
      }));
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">
            Complete Your Profile
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Profile updated successfully! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Disability Information Section */}
            <div className="mb-8 border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Disability Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Disability Type
                  </label>
                  <select
                    name="disabilityType"
                    value={formData.disabilityType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your disability type</option>
                    <option value="Physical">Physical</option>
                    <option value="Visual">Visual</option>
                    <option value="Hearing">Hearing</option>
                    <option value="Cognitive">Cognitive</option>
                    <option value="Intellectual">Intellectual</option>
                    <option value="Psychosocial">Psychosocial</option>
                    <option value="Multiple">Multiple Disabilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Disability Severity
                  </label>
                  <select
                    name="disabilitySeverity"
                    value={formData.disabilitySeverity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select severity level</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Profound">Profound</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Disability Description (Optional)
                </label>
                <textarea
                  name="disabilityDescription"
                  value={formData.disabilityDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe your disability if you wish"
                ></textarea>
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="needsAccommodation"
                    checked={formData.needsAccommodation}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    I require workplace accommodations
                  </span>
                </label>
              </div>

              {formData.needsAccommodation && (
                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Accommodation Requirements
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={currentAccommodation}
                      onChange={(e) => setCurrentAccommodation(e.target.value)}
                      className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add an accommodation need"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleAddItem(
                          "accommodationRequirements",
                          currentAccommodation,
                          setCurrentAccommodation
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.accommodationRequirements.map((item, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem("accommodationRequirements", item)
                          }
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Professional Information Section */}
            <div className="mb-8 border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Professional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Profession Type
                  </label>
                  <select
                    name="professionType"
                    value={formData.professionType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your profession type</option>
                    <option value="Engineering/Technical">
                      Engineering/Technical
                    </option>
                    <option value="Creative/Arts">Creative/Arts</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Service">Service</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Skilled Trade">Skilled Trade</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your experience level</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Experienced">Experienced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Skills
                </label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem("skills", skill)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Education Level
                </label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your education level</option>
                  <option value="No Formal Education">
                    No Formal Education
                  </option>
                  <option value="Primary">Primary School</option>
                  <option value="Secondary">Secondary School</option>
                  <option value="Diploma">Diploma/Certificate</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Files Section */}
            <div className="mb-8 border-b pb-6">
              <div className="mb-8 border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Documents (Optional)
                </h2>

                {/* Profile Image and Resume */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Profile Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Profile Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="profileImage"
                          onChange={(e) => handleFileChange(e, "profileImage")}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                        />
                      </div>
                      {formData.profileImage && (
                        <span className="text-sm text-gray-600 truncate max-w-[120px]">
                          {formData.profileImage.split("/").pop()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted: JPG, PNG (Max 5MB)
                    </p>
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Resume/CV
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="resumeFile"
                          onChange={(e) => handleFileChange(e, "resumeFile")}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                      {formData.resumeFile && (
                        <span className="text-sm text-gray-600 truncate max-w-[120px]">
                          {formData.resumeFile.split("/").pop()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted: PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>
                </div>

                {/* Certifications Upload */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Certifications (Max 5)
                  </label>
                  <input
                    type="file"
                    id="certifications"
                    onChange={(e) =>
                      setFileUploads((prev) => ({
                        ...prev,
                        certificationFiles: Array.from(e.target.files),
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,image/*"
                    multiple
                  />
                  <p className="text-xs text-gray-500">
                    Accepted: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)
                  </p>

                  {formData.certificationFiles?.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Current Certifications:
                      </h4>
                      <ul className="space-y-1">
                        {formData.certificationFiles.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between text-sm text-gray-600"
                          >
                            <span className="truncate max-w-[180px]">
                              {file.split("/").pop()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCertification(index)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Accessibility Preferences Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Accessibility Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Preferred Contact Methods
                  </label>
                  <select
                    name="preferredContactMethods"
                    multiple
                    value={formData.preferredContactMethods}
                    onChange={handleMultiSelect}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-auto"
                    size="4"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Video Call">Video Call</option>
                    <option value="Text">Text Message</option>
                    <option value="In Person">In Person</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple options
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Additional Requirements
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="requiresSignLanguage"
                        checked={formData.requiresSignLanguage}
                        onChange={handleChange}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">
                        Requires Sign Language Interpreter
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="requiresCaptioning"
                        checked={formData.requiresCaptioning}
                        onChange={handleChange}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">
                        Requires Captioning for Videos
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="requiresAltText"
                        checked={formData.requiresAltText}
                        onChange={handleChange}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">
                        Requires Alt Text for Images
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileEdit;
