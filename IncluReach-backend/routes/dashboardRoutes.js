import express from "express";
import {
  getDashboardData,
  getApplications,
  getApplicationDetails,
  withdrawApplication,
  getOffers,
  getSelectedJobs,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDashboardData);

router.get("/applications", protect, getApplications);

router
  .route("/applications/:id")
  .get(protect, getApplicationDetails)
  .delete(protect, withdrawApplication);

router.get("/offers", protect, getOffers);

router.get("/selected-jobs", protect, getSelectedJobs);

export default router;
