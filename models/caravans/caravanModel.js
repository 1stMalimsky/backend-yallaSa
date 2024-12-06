const mongoose = require("mongoose");

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
    features: {
      hasAC: { type: Boolean, default: false },
      hasTV: { type: Boolean, default: false },
      shabbatSystem: { type: Boolean, default: false },
      kosherCaravan: { type: Boolean, default: false },
    },
    locationDetails: {
      city: { type: String },
      street: { type: String },
      gpsData: { type: [Number] },
    },
    bookedDates: {
      type: Map,
      of: {
        type: Map,
        of: [resrevationDateSchema],
      },
    },
  },
  { timestamps: true }
);

const Caravan = mongoose.model("Caravan", caravanSchema);

module.exports = Caravan;
