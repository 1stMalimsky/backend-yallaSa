const mongoose = require("mongoose");

const licenseImageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const LicenseImage = mongoose.model(
  "LicenseImage",
  licenseImageSchema,
  "licenseImages"
);

module.exports = LicenseImage;
