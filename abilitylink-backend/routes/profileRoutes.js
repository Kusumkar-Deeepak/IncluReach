import express from "express";
import { updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/fileUpload.js";

const router = express.Router();

router.put(
  "/",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
    { name: "certificationFiles", maxCount: 5 },
  ]),
  updateProfile
);

export default router;
