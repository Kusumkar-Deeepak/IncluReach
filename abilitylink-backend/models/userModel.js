import mongoose from "mongoose";

// models/User.js
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      // Disability Information
      disabilityType: {
        type: String,
        enum: [
          "Physical",
          "Visual",
          "Hearing",
          "Cognitive",
          "Intellectual",
          "Psychosocial",
          "Multiple",
          "Other",
        ],
      },
      disabilitySeverity: {
        type: String,
        enum: ["Mild", "Moderate", "Severe", "Profound"],
      },
      disabilityDescription: String,
      needsAccommodation: Boolean,
      accommodationRequirements: [String],

      // Professional Information
      professionType: {
        type: String,
        enum: [
          "Engineering/Technical",
          "Creative/Arts",
          "Administrative",
          "Service",
          "Healthcare",
          "Education",
          "Skilled Trade",
          "Other",
        ],
      },
      skills: [String],
      experienceLevel: {
        type: String,
        enum: ["Entry", "Intermediate", "Experienced", "Expert"],
      },

      // Education
      educationLevel: {
        type: String,
        enum: [
          "No Formal Education",
          "Primary",
          "Secondary",
          "Diploma",
          "Bachelor",
          "Master",
          "Doctorate",
          "Other",
        ],
      },

      // Media Files
      resumeFile: String,
      portfolioFile: String,
      certificationFiles: [String],
      profileImage: String,

      // Contact Preferences
      preferredContactMethods: [
        {
          type: String,
          enum: ["Email", "Phone", "Video Call", "Text", "In Person"],
        },
      ],

      // Accessibility Preferences
      requiresSignLanguage: Boolean,
      requiresCaptioning: Boolean,
      requiresAltText: Boolean,

      profileCompletion: { type: Number, default: 0 },
    },
    jobApplications: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        status: {
          type: String,
          enum: ["Applied", "Interview", "Rejected", "Offer"],
          default: "Applied",
        },
        appliedDate: { type: Date, default: Date.now },
        updates: [
          {
            type: {
              type: String,
              enum: ["StatusChange", "Message", "Interview"],
            },
            message: String,
            date: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    activityLog: [
      {
        type: {
          type: String,
          enum: ["Application", "ProfileView", "JobMatch", "StatusChange"],
        },
        details: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
