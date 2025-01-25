const mongoose = require("mongoose");

const caravanImageSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    caravanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caravan",
    },
  },
  { timestamps: true }
);

const CaravanImage = mongoose.model("CaravanImage", caravanImageSchema);

module.exports = CaravanImage;
