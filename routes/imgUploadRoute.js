const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const router = express.Router();
const userServiceModel = require("../models/users/userService");
const LicenseImage = require("../models/images/licenseImgModel");
const CaravanImage = require("../models/images/caravanImgModel");
const { loggedInCheck, compareUserToken } = require("./helpers/middleware");
const mongoose = require("mongoose");

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    // Only allow image files
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
}).fields([
  { name: "licenseImage", maxCount: 1 },
  { name: "caravanImages", maxCount: 5 },
]);

/* UPLOAD IMAGE */
router.post(
  "/uploadimage/:id",
  loggedInCheck,
  compareUserToken,
  upload,
  async (req, res) => {
    try {
      if (req.files.licenseImage) {
        console.log("licenseImage Data:", req.files.licenseImage[0]);
      }
      const userId = req.tokenPayload.userId;
      let savedCaravans = [];

      if (req.files.licenseImage) {
        console.log("Uploading license");
        const licenseImage = req.files.licenseImage[0];
        const licenseImageData = {
          filename: licenseImage.originalname,
          path: `data:${
            licenseImage.mimetype
          };base64,${licenseImage.buffer.toString("base64")}`,
          contentType: licenseImage.mimetype,
        };
        const updatedLicense = await userServiceModel.updateUser(userId, {
          $set: {
            license: licenseImageData,
          },
        });
        console.log("here", updatedLicense.license.filename);
        res.status(200).json({
          message: "Files uploaded successfully",
          license: updatedLicense.license,
        });
      }

      if (req.files.caravanImages && req.files.caravanImages.length) {
        console.log("Uploading caravan images");
        for (let image of req.files.caravanImages) {
          const caravanImageData = {
            filename: image.originalname,
            path: `data:${image.mimetype};base64,${image.buffer.toString(
              "base64"
            )}`,
            contentType: image.mimetype,
            userId: userId, // Assuming you want to link these to the user or a specific caravan
          };
          const savedCaravanImage = await CaravanImage.create(caravanImageData);
          savedCaravans.push(savedCaravanImage);
        }
        res.status(200).json({
          message: "Files uploaded successfully",
          caravanImages: savedCaravans,
        });
      } else if (!req.files.licenseImage) {
        res.status(400).json({ message: "No images provided" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Error uploading files." });
    }
  }
);

/* DELETE IMAGE */
router.patch(
  "/resetlicense/:id",
  loggedInCheck,
  compareUserToken,
  async (req, res) => {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const updatedUser = await userServiceModel.updateUser(userId, {
        $set: { license: { filename: "", path: "", contentType: "" } },
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "License image deleted successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error resetting license:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
