const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const router = express.Router();

const LicenseImage = require("../models/images/licenseImgModel");
const CaravanImage = require("../models/images/caravanImgModel");
const { loggedInCheck } = require("./helpers/middleware");

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
router.post("/uploadimage", upload, async (req, res) => {
  try {
    let savedLicense = null;
    let savedCaravans = [];

    if (req.files.licenseImage) {
      console.log("uploading license");
      const licenseImage = req.files.licenseImage[0];
      const licenseImageData = {
        filename: licenseImage.originalname,
        path: `data:${
          licenseImage.mimetype
        };base64,${licenseImage.buffer.toString("base64")}`,
        contentType: licenseImage.mimetype,
      };
      savedLicense = await LicenseImage.create(licenseImageData);
      res.status(200).json({
        message: "license uploaded successfully",
        id: savedLicense._id,
      });
    }
    if (req.files.caravanImages && req.files.caravanImages.length) {
      console.log("uploading caravanimgs");

      for (let image of req.files.caravanImages) {
        const caravanImageData = {
          filename: image.originalname,
          path: `data:${image.mimetype};base64,${image.buffer.toString(
            "base64"
          )}`,
          contentType: image.mimetype,
        };
        const savedCaravanImage = await CaravanImage.create(caravanImageData);
        savedCaravans.push(savedCaravanImage);
        res.status(200).send({
          message: "Files uploaded successfully.",
          caravanImages: savedCaravans,
        });
      }
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send({ error: "Error uploading files." });
  }
});

/* DELETE IMAGE */
router.delete("/deleteimage/:id", loggedInCheck, async (req, res) => {
  try {
    const licenseId = req.params.id;
    const deletedImage = await LicenseImage.findByIdAndDelete(licenseId);
    if (!deletedImage) {
      res.status(404).json({ message: "License image not found" });
    }
    res.status(200).json({ message: "license image deleted" });
  } catch (err) {
    console.log("delete image error");
    res.status(500).json({ message: "delete image error", error: err });
  }
});

module.exports = router;
