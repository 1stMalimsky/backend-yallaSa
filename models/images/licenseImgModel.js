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
    caravanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caravan",
    },
  },
  { timestamps: true }
);

const LicenseImage = mongoose.model("LicenseImage", licenseImageSchema);

module.exports = LicenseImage;
