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
  { name: "licenseImages", maxCount: 3 },
  { name: "caravanImages", maxCount: 5 },
]);

/* UPLOAD IMAGE */

router.post(
  "/uploadimage/:contentType/:id/:caravanId",
  loggedInCheck,
  compareUserToken,
  upload,
  async (req, res) => {
    let contentType = req.params.contentType;
    let caravanId = req.params.caravanId;
    let userId = req.params.id;
    try {
      console.log("async contentType", contentType);
      if (
        contentType === "caravans" &&
        req.files.caravanImages &&
        req.files.caravanImages.length
      ) {
        const image = req.files.caravanImages[0];
        const caravanImageData = {
          filename: image.originalname,
          path: `data:${image.mimetype};base64,${image.buffer.toString(
            "base64"
          )}`,
          contentType: image.mimetype,
          userId: new mongoose.Types.ObjectId(userId),
          caravanId: new mongoose.Types.ObjectId(caravanId),
        };

        const newCaravanImage = await CaravanImage.create(caravanImageData);
        if (newCaravanImage) {
          res.status(200).json(newCaravanImage);
        }
      }
      if (
        contentType === "license" /* &&
        req.files.licenseImage &&
        req.files.licenseImage.length */
      ) {
        console.log("here");
        const licenseImage = req.files.licenseImages[0];
        const licenseImageData = {
          filename: licenseImage.originalname,
          path: `data:${
            licenseImage.mimetype
          };base64,${licenseImage.buffer.toString("base64")}`,
          contentType: licenseImage.mimetype,
          userId: new mongoose.Types.ObjectId(userId),
          caravanId: new mongoose.Types.ObjectId(caravanId),
        };
        const licenseImg = await LicenseImage.create(licenseImageData);
        if (licenseImg) {
          res.status(200).json({
            message: "license File uploaded successfully",
            license: licenseImg,
          });
        } else return res.status(400).json({ error: "Error uploading files." });
      }
      console.log("nowhereLand");
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Error uploading files.", error: error });
    }
  }
);

/* DELETE CARAVAN IMAGE */
router.delete(
  "/removeimage/:collectionType/:id/:imageId/",
  loggedInCheck,
  compareUserToken,
  async (req, res) => {
    try {
      let userId = req.params.id;
      let imageId = req.params.imageId;
      let collectionType = req.params.collectionType;

      if (collectionType === "caravans") {
        const deletedCaravanImage = await CaravanImage.findByIdAndDelete(
          imageId
        );
        if (!deletedCaravanImage) {
          return res.status(404).json({ message: "Caravan image not found" });
        }
        res.status(200).json({
          message: "Caravan image deleted successfully",
          caravanImage: deletedCaravanImage,
        });
      }
      if (collectionType === "license") {
        const deletedLicenseImage = await LicenseImage.findByIdAndDelete(
          imageId
        );
        if (!deletedLicenseImage) {
          return res.status(404).json({ message: "License image not found" });
        }
        res.status(200).json({
          message: "License image deleted successfully",
          licenseImage: deletedLicenseImage,
        });
      }
    } catch (error) {
      console.error("Error deleting license/caravan image:", error);
      res.status(500).json({ error: "Error deleting caravan image" });
    }
  }
);
/* DELETE LICENSE IMAGE */
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
