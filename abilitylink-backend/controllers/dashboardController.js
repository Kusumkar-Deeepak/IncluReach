import User from "../models/userModel.js";
import Job from "../models/jobModel.js";
import mongoose from "mongoose";

// Get complete dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get user with populated data
    const user = await User.findById(userId)
      .populate({
        path: "jobApplications.jobId",
        select: "title company location remote skills createdAt",
      })
      .populate({
        path: "savedJobs",
        select: "title company location remote skills createdAt",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate profile completion
    const profileFields = [
      user.profile?.disabilityType,
      user.profile?.disabilitySeverity,
      user.profile?.skills?.length > 0,
      user.profile?.resumeFile,
    ];
    const completedFields = profileFields.filter(Boolean).length;
    const profileCompletion = Math.round(
      (completedFields / profileFields.length) * 100
    );

    // Build job recommendation query
    const jobQuery = {
      status: "Active",
      $or: [],
    };

    if (user.profile?.disabilityType) {
      jobQuery.$or.push({
        disabilityTypes: user.profile.disabilityType,
        $or: [
          { disabilitySeverity: user.profile.disabilitySeverity },
          { disabilitySeverity: "Any" },
        ],
      });
    }

    if (user.profile?.skills?.length > 0) {
      jobQuery.$or.push({
        skills: { $in: user.profile.skills },
      });
    }

    if (jobQuery.$or.length === 0) {
      jobQuery.$or.push({ status: "Active" });
    }

    // Get recommended jobs
    let recommendedJobs = await Job.find(jobQuery)
      .select(
        "title company location remote skills createdAt disabilityTypes disabilitySeverity"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    // Filter out applied jobs
    const appliedJobIds = user.jobApplications.map((app) =>
      app.jobId?._id?.toString()
    );
    recommendedJobs = recommendedJobs.filter(
      (job) => !appliedJobIds.includes(job._id.toString())
    );

    // Format response
    const dashboardData = {
      profileCompletion,
      applications: user.jobApplications
        .map((app) => ({
          _id: app._id,
          status: app.status,
          appliedDate: app.appliedDate,
          job: app.jobId
            ? {
                _id: app.jobId._id,
                title: app.jobId.title,
                company: app.jobId.company,
                location: app.jobId.location,
                remote: app.jobId.remote,
              }
            : null,
        }))
        .filter((app) => app.job !== null),
      savedJobs: user.savedJobs,
      activityLog: user.activityLog
        .slice(0, 5)
        .reverse()
        .map((log) => ({
          ...log.toObject(),
          details: log.details || "Activity recorded",
        })),
      recommendedJobs: recommendedJobs.map((job) => ({
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        skills: job.skills,
        postedDate: job.createdAt,
        disabilityTypes: job.disabilityTypes,
        disabilitySeverity: job.disabilitySeverity,
      })),
      user: {
        fullName: user.fullName,
        email: user.email,
        profile: user.profile,
      },
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard controller error:", error);
    res.status(500).json({
      message: "Server error while fetching dashboard data",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Get all applications for a user
export const getApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: "jobApplications.jobId",
      select: "title company location remote description postedBy",
      populate: {
        path: "postedBy",
        select: "companyName", // or whatever field you want from the poster
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transform the data structure to match frontend expectations
    const applications = user.jobApplications.map((app) => ({
      _id: app._id,
      status: app.status,
      appliedDate: app.appliedAt,
      updates: app.updates || [],
      job: app.jobId, // jobId becomes job
    }));

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({
      message: "Server error while fetching applications",
      error: error.message,
    });
  }
};

// Get single application details
export const getApplicationDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const applicationId = req.params.id;

    const user = await User.findOne(
      { _id: userId, "jobApplications._id": applicationId },
      { "jobApplications.$": 1 }
    ).populate({
      path: "jobApplications.jobId",
      select: "title company location remote description",
    });

    if (!user || !user.jobApplications.length) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(user.jobApplications[0]);
  } catch (error) {
    console.error("Get application details error:", error);
    res.status(500).json({
      message: "Server error while fetching application details",
      error: error.message,
    });
  }
};

// Withdraw application
export const withdrawApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const applicationId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { jobApplications: { _id: applicationId } },
        $push: {
          activityLog: {
            type: "StatusChange",
            details: `Withdrew application ${applicationId}`,
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Withdraw application error:", error);
    res.status(500).json({
      message: "Server error while withdrawing application",
      error: error.message,
    });
  }
};

// Get job offers
export const getOffers = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await User.findById(userId).populate({
      path: "jobApplications.jobId",
      match: { "jobApplications.status": "Offer" },
    });

    const offers = applications.jobApplications.filter(
      (app) => app.status === "Offer"
    );
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSelectedJobs = async (req, res) => {
  try {
    // Find all jobs where current user is in acceptedApplicants
    const jobs = await Job.find({
      "acceptedApplicants.user": req.user._id,
    })
      .select(
        "title company location remote description disabilityTypes createdAt postedBy acceptedApplicants"
      ) // Make sure to include acceptedApplicants in the select
      .populate("postedBy", "fullName email profile.profileImage");

    // Transform the data to match frontend expectations
    const selectedJobs = jobs.map((job) => {
      // Safely handle cases where acceptedApplicants might be missing
      const acceptedApplicants = job.acceptedApplicants || [];

      // Find the accepted applicant record for this user
      const acceptanceRecord = acceptedApplicants.find(
        (applicant) => applicant.user && applicant.user.equals(req.user._id)
      );

      return {
        _id: job._id, // Use the actual job ID
        jobId: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          remote: job.remote,
          description: job.description,
          disabilityTypes: job.disabilityTypes,
          createdAt: job.createdAt,
          postedBy: job.postedBy,
        },
        status: "Offer",
        appliedDate:
          acceptanceRecord?.acceptedAt || job.createdAt || new Date(),
        updates: [],
      };
    });

    res.status(200).json({
      success: true,
      count: selectedJobs.length,
      data: selectedJobs,
    });
  } catch (error) {
    console.error("Error fetching selected jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch selected jobs",
      error: error.message,
    });
  }
};
