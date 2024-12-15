const mongoose = require("mongoose");
const Reservation = require("../reservations/reservationModel");

const resrevationDateSchema = new mongoose.Schema({
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
});

const imageSchema = new mongoose.Schema({
  imgNumber: { type: Number, required: true },
  original: { type: String, required: true },
  thumbnail: { type: String, required: true },
  alt: { type: String },
});

const caravanSchema = new mongoose.Schema(
  {
    /* TEMPORARY */
    ownerId: { type: Number, required: true },
    //ownerId: { type: mongoose.Schema.Types.ObjectId },
    /* TEMPORARY */
    model: { type: String, required: true },
    images: [imageSchema],
    description: { type: String },
    pricePerNight: { type: Number, required: true },
    numOfBeds: { type: Number },
    numOfSeats: { type: Number },
    measurements: {
      length: { type: Number },
      width: { type: Number },
      weight: { type: String },
    },
    features: {
      hasAC: { type: Boolean, default: false },
      hasTV: { type: Boolean, default: false },
      shabbatSystem: { type: Boolean, default: false },
      kosherCaravan: { type: Boolean, default: false },
      kitchen: { type: Boolean, default: false },
    },
    locationDetails: {
      city: { type: String },
      street: { type: String },
      gpsData: { type: [Number] },
    },
    reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
  },
  { timestamps: true }
);

const Caravan = mongoose.model("Caravan", caravanSchema);

module.exports = Caravan;
