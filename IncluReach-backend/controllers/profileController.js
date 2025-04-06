import User from "../models/userModel.js";
import path from "path";
import fs from "fs/promises";

// Helper function to delete old files
const deleteOldFile = async (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(process.cwd(), "public", filePath);
  try {
    await fs.access(fullPath);
    await fs.unlink(fullPath);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};

// Calculate profile completion percentage
const calculateCompletion = (profileData) => {
  const requiredFields = [
    "disabilityType",
    "disabilitySeverity",
    "professionType",
    "skills",
    "educationLevel",
  ];

  const completedFields = requiredFields.filter(
    (field) =>
      profileData[field] &&
      (!Array.isArray(profileData[field]) || profileData[field].length > 0)
  ).length;

  return Math.round((completedFields / requiredFields.length) * 100);
};

// Process file uploads
const processFileUploads = async (files, existingProfile) => {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const updates = {};

  // Process profile image
  if (files.profileImage) {
    await deleteOldFile(existingProfile.profileImage);
    const filename = `profile-${Date.now()}${path.extname(
      files.profileImage[0].originalname
    )}`;
    const filePath = `uploads/${req.file.filename}`;
    await fs.writeFile(filePath, files.profileImage[0].buffer);
    updates.profileImage = `uploads/${filename}`;
  }

  // Process resume
  if (files.resumeFile) {
    await deleteOldFile(existingProfile.resumeFile);
    const filename = `resume-${Date.now()}${path.extname(
      files.resumeFile[0].originalname
    )}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, files.resumeFile[0].buffer);
    updates.resumeFile = `uploads/${filename}`;
  }

  // Process certifications
  if (files.certificationFiles) {
    // Delete old certifications
    if (existingProfile.certificationFiles) {
      await Promise.all(existingProfile.certificationFiles.map(deleteOldFile));
    }

    // Save new certifications
    const certFiles = await Promise.all(
      files.certificationFiles.map(async (file, index) => {
        const filename = `cert-${Date.now()}-${index}${path.extname(
          file.originalname
        )}`;
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, file.buffer);
        return `uploads/${filename}`;
      })
    );

    updates.certificationFiles = certFiles;
  }

  return updates;
};

export const updateProfile = async (req, res) => {
  try {
    const { user, body, files } = req;

    // Process text fields
    const textUpdates = {};
    Object.entries(body).forEach(([key, value]) => {
      if (
        key === "needsAccommodation" ||
        key === "requiresSignLanguage" ||
        key === "requiresCaptioning" ||
        key === "requiresAltText"
      ) {
        textUpdates[key] = value === "true" || value === true;
      } else {
        textUpdates[key] = value;
      }
    });

    // Process file uploads - store relative paths without 'public/'
    const fileUpdates = {};
    if (files.profileImage) {
      fileUpdates.profileImage = files.profileImage[0].path.replace(
        "public/",
        ""
      );
    }
    if (files.resumeFile) {
      fileUpdates.resumeFile = files.resumeFile[0].path.replace("public/", "");
    }
    if (files.certificationFiles) {
      fileUpdates.certificationFiles = files.certificationFiles.map((file) =>
        file.path.replace("public/", "")
      );
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          profile: { ...textUpdates, ...fileUpdates },
        },
        $push: {
          activityLog: {
            type: "ProfileUpdate",
            details: "Updated profile information",
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      profile: updatedUser.profile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
