const mongoose = require("mongoose");

const blockedDateSchema = new mongoose.Schema(
  {
    blockedDate: {
      type: Boolean,
      default: true,
    },
    title: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caravanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caravan",
      required: true,
    },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlockedDate", blockedDateSchema);
