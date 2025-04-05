import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    remote: { type: Boolean, default: false },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    disabilityTypes: [
      {
        type: String,
        enum: ["Physical", "Visual", "Hearing", "Cognitive", "Other"],
      },
    ],
    disabilitySeverity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe", "Any"],
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: Date,
        status: {
          type: String,
          enum: ["Applied", "Interview", "Offer", "Rejected"],
          default: "Applied",
        },
      },
    ],
    acceptedApplicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        acceptedAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
