import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import { verifyJobPosting } from "../utils/geminiVerifier.js";
import mongoose from "mongoose";

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .populate("postedBy", "fullName email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "fullName email")
      .populate("applicants", "fullName email")
      .lean();

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure arrays exist
    job.requirements = job.requirements || [];
    job.skills = job.skills || [];
    job.applicants = job.applicants || [];

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Job creation with strict validation
export const createJob = async (req, res) => {
  try {
    const { body, user } = req;

    // Verify the job
    const verification = await verifyJobPosting(body);

    // Only reject obviously scammy jobs
    if (!verification.isValid && verification.riskScore === 100) {
      return res.status(400).json({
        success: false,
        message: "Job rejected - scam detected",
        details: verification,
      });
    }

    // Store all other jobs (including those needing review)
    const job = await Job.create({
      ...body,
      postedBy: user._id,
      status: verification.riskScore < 50 ? "active" : "pending",
      verification: {
        riskScore: verification.riskScore,
        redFlags: verification.redFlags,
        lastVerified: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      job,
      verification,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Separate endpoint for approving pending jobs
export const approveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { user } = req;

    // In a real implementation, you would:
    // 1. Retrieve the job from your temporary storage
    // 2. Verify admin permissions
    // 3. Create the actual job record

    // This is a simplified version
    const job = await Job.findByIdAndUpdate(
      jobId,
      { status: "active", approvedBy: user._id, approvedAt: new Date() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Job approved and published",
      job,
    });
  } catch (error) {
    console.error("Job approval error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during job approval",
    });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;
    const appliedAt = new Date();

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(jobId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own job posting",
      });
    }

    // Check if user is a recruiter
    const user = await User.findById(userId);
    if (user.role === "recruiter") {
      return res.status(400).json({
        success: false,
        message: "Recruiters cannot apply for jobs",
      });
    }

    // Check if already applied
    const alreadyApplied = await User.findOne({
      _id: userId,
      "jobApplications.jobId": jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Add application to user
    await User.findByIdAndUpdate(userId, {
      $push: {
        jobApplications: {
          jobId,
          status: "Applied",
          appliedAt,
          updates: [
            {
              type: "StatusChange",
              message: "Application submitted",
              date: appliedAt,
            },
          ],
        },
        activityLog: {
          type: "Application",
          details: `Applied for job: ${job.title}`,
          date: appliedAt,
        },
      },
    });

    // Add user to job's applicants
    await Job.findByIdAndUpdate(
      jobId,
      {
        $addToSet: {
          applicants: {
            user: userId,
            appliedAt,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      jobId,
      appliedAt,
    });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process application",
    });
  }
};

export const checkIfApplied = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const userId = req.user._id;

    // Check if user has applied to this job
    const user = await User.findOne({
      _id: userId,
      "jobApplications.jobId": jobId,
    });

    // Also check if user is in job's applicants list
    const job = await Job.findOne({
      _id: jobId,
      "applicants.user": userId,
    });

    res.json({
      success: true,
      applied: !!user || !!job,
    });
  } catch (error) {
    console.error("Check if applied error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to check application status",
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate({
        path: "applicants.user",
        select: "fullName email profile",
      })
      .populate({
        path: "acceptedApplicants.user", // Add this population
        select: "fullName email profile",
      });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch jobs",
    });
  }
};

export const acceptApplicant = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { applicantId } = req.body;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(jobId) ||
      !mongoose.Types.ObjectId.isValid(applicantId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Convert to ObjectId for consistent comparison
    const jobObjectId = new mongoose.Types.ObjectId(jobId);
    const applicantObjectId = new mongoose.Types.ObjectId(applicantId);

    // Verify job exists and belongs to the user
    const job = await Job.findOneAndUpdate(
      {
        _id: jobObjectId,
        postedBy: req.user._id,
      },
      {},
      { new: true }
    ).populate("applicants.user");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you don't have permission",
      });
    }

    // Find the applicant in applicants array
    const applicantIndex = job.applicants.findIndex((app) =>
      app.user._id.equals(applicantObjectId)
    );

    if (applicantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Applicant not found for this job",
      });
    }

    // Check if already accepted
    const alreadyAccepted = job.acceptedApplicants.some((accApp) =>
      accApp.user.equals(applicantObjectId)
    );

    if (alreadyAccepted) {
      return res.status(400).json({
        success: false,
        message: "Applicant already accepted for this job",
      });
    }

    // Get the applicant data before removing
    const applicantData = job.applicants[applicantIndex];

    // Remove from applicants and add to acceptedApplicants in a single operation
    const updatedJob = await Job.findByIdAndUpdate(
      jobObjectId,
      {
        $pull: { applicants: { user: applicantObjectId } },
        $push: {
          acceptedApplicants: {
            user: applicantObjectId,
            acceptedAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("acceptedApplicants.user");

    // Update user's application status to "Offer"
    await User.updateOne(
      {
        _id: applicantId,
        "jobApplications.jobId": jobId,
      },
      {
        $set: { "jobApplications.$.status": "Offer" },
        $push: {
          "jobApplications.$.updates": {
            type: "StatusChange",
            message: "You've received a job offer!",
            date: new Date(),
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Job offer sent to applicant successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error accepting applicant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send job offer",
      error: error.message,
    });
  }
};

export const getApplicantDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicant ID format",
      });
    }

    const applicantId = new mongoose.Types.ObjectId(id);

    const applicant = await User.findById(applicantId)
      .select("fullName email profile")
      .lean();

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    // Ensure profile exists
    applicant.profile = applicant.profile || {};

    // Clean up file paths by removing any 'public/' prefix
    if (applicant.profile.profileImage) {
      applicant.profile.profileImage = applicant.profile.profileImage.replace(
        /^public\//,
        ""
      );
    }
    if (applicant.profile.resumeFile) {
      applicant.profile.resumeFile = applicant.profile.resumeFile.replace(
        /^public\//,
        ""
      );
    }
    if (applicant.profile.certificationFiles) {
      applicant.profile.certificationFiles =
        applicant.profile.certificationFiles.map((file) =>
          file.replace(/^public\//, "")
        );
    }

    res.status(200).json({
      success: true,
      applicant,
    });
  } catch (error) {
    console.error("Error fetching applicant details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applicant details",
      error: error.message,
    });
  }
};
