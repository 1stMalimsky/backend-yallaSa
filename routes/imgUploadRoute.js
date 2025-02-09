const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const router = express.Router();
const userServiceModel = require("../models/users/userService");
const LicenseImage = require("../models/images/licenseImgModel");
const CaravanImage = require("../models/images/caravanImgModel");
const UserImage = require("../models/images/userImageModel");
const imageService = require("../models/images/imageService");
const { loggedInCheck, compareUserToken } = require("./helpers/middleware");
const mongoose = require("mongoose");

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    // Only allow image files
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
}).fields([
  { name: "licenseImages", maxCount: 3 },
  { name: "caravanImages", maxCount: 5 },
  { name: "userImages", maxCount: 1 },
]);

/* UPLOAD CARAVAN IMAGES */

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
        contentType === "caravanImages" &&
        req.files.caravanImages &&
        req.files.caravanImages.length
      ) {
        const image = req.files.caravanImages[0];
        console.log("caravanImage mimeType", image);

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
          return res.status(200).json(newCaravanImage);
        }
      }
      if (
        contentType === "licenseImages" &&
        req.files.licenseImages &&
        req.files.licenseImages.length
      ) {
        const licenseImage = req.files.licenseImages[0];
        console.log("licenseImage mimeType", licenseImage.mimetype);

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
          return res.status(200).json(licenseImg);
        } else return res.status(400).json({ error: "Error uploading files." });
      }
      return console.log("no contentType detected");
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Error uploading files.", error: error });
    }
  }
);

/* DELETE CARAVAN IMAGES */
router.delete(
  "/removeimage/:contentType/:id/:imageId/",
  loggedInCheck,
  compareUserToken,
  async (req, res) => {
    try {
      let userId = req.params.id;
      let imageId = req.params.imageId;
      let contentType = req.params.contentType;

      if (contentType === "caravanImages") {
        console.log("in delete caravanImage");

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
      if (contentType === "licenseImages") {
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

/* UPLOAD USER LICENSE IMAGE */

router.post(
  "/uploadlicense/:id",
  loggedInCheck,
  compareUserToken,
  upload,
  async (req, res) => {
    const userId = req.params.id;
    try {
      if (req.files.userImages && req.files.userImages.length) {
        const userImage = req.files.userImages[0];
        //console.log("userImage mimeType", userImage);

        const userImageData = {
          filename: userImage.originalname,
          path: `data:${userImage.mimetype};base64,${userImage.buffer.toString(
            "base64"
          )}`,
          contentType: userImage.mimetype,
          userId: new mongoose.Types.ObjectId(userId),
        };

        const newUserImage = await UserImage.create(userImageData);
        if (newUserImage) {
          return res.status(200).json(newUserImage);
        }
      }
    } catch (err) {
      console.log("upload license err", err);
      res
        .status(500)
        .json({ message: "Error uploading license image", error: err });
    }
  }
);

/* DELETE LICENSE IMAGE */
router.delete(
  "/deletelicense/:userId/:imageId/",
  loggedInCheck,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      if (userId !== req.params.userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this image" });
      }
      const deleteImage = await imageService.deleteImage(
        userId,
        req.params.imageId,
        UserImage
      );
      res.status(200).json({
        message: "User image deleted successfully",
      });
    } catch (error) {
      console.error("Error resetting license:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
/* GET LICENSE IMAGES */
router.get("/getlicenseimages/:caravanId", loggedInCheck, async (req, res) => {
  try {
    const caravanId = req.params.caravanId;
    const foundImages = await imageService.getLicenseImages(caravanId);
    if (foundImages) {
      res
        .status(200)
        .json({ message: "found licenseImages", images: foundImages });
    }
  } catch (err) {
    res.status(400).json({ message: "get licenseImages err", error: err });
  }
});

/* GET  USER IMAGES */
router.get("/getuserimages/:userId", loggedInCheck, async (req, res) => {
  try {
    const userId = req.params.userId;
    const foundImages = await imageService.getUserImages(userId);
    if (foundImages) {
      res
        .status(200)
        .json({ message: "found userImages", images: foundImages });
    }
  } catch (err) {
    res.status(400).json({ message: "get user images err", error: err });
  }
});

module.exports = router;
