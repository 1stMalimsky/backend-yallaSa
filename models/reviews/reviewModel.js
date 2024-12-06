const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    /* TEMPORARY */
    userId: { type: String, required: true, ref: "User" },
    /* userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, */
    reservationId: { type: String, required: true, ref: "Reservation" },
    rating: { type: Number, required: true, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
