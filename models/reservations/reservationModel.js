const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservedDatesSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  numOfDays: { type: Number, required: true },
  pickupTime: { type: String, required: true },
  dropoffTime: { type: String, required: true },
});

const priceDetailsSchema = new mongoose.Schema({
  grandTotal: { type: Number, required: true },
  totalExtras: { type: Number, required: true },
  insurance: { type: Number, required: true },
  cancelation: { type: Number, required: true },
});

const reservationSchema = new mongoose.Schema(
  {
    listingName: { type: String, required: true },
    userName: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caravanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caravan",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dates: { type: reservedDatesSchema, required: true },
    priceDetails: { type: priceDetailsSchema, required: true },
    extras: { type: Object, default: {} },
    insuranceSelected: {
      type: String,
      enum: ["basic", "premium"],
      default: "basic",
    },
    cancelationPolicy: {
      type: String,
      enum: ["basic", "flexible"],
      default: "basic",
    },
    status: {
      type: String,
      enum: ["confirmed", "canceled"],
      default: "confirmed",
    },
    location: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: String, required: true },
      gpsLocation: { type: [Number] },
    },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
