// jobsRoutes.js
import express from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  applyForJob,
  checkIfApplied,
  getMyJobs,
  acceptApplicant,
  getApplicantDetails,
  closeJob,
} from "../controllers/jobsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific routes first
router.get("/my-jobs", protect, getMyJobs);
router.get("/my-jobs/check-applied", protect, checkIfApplied); // Add this specific route

// General routes
router.get("/", getAllJobs);
router.post("/", protect, createJob);
router.get("/:id", getJobById);
router.get("/:id/check-applied", protect, checkIfApplied);
router.post("/:id/apply", protect, applyForJob);
router.put("/:jobId/accept", protect, acceptApplicant);
router.get("/applicants/:id", protect, getApplicantDetails);
router.put("/:jobId/close", protect, closeJob);

export default router;
