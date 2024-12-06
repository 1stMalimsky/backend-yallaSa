const mongoose = require("mongoose");

const reservedDatesSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  numOfDays: { type: Number, required: true },
});

const priceDetailsSchema = new mongoose.Schema({
  grandTotal: { type: Number, required: true },
  totalExtras: { type: Number, required: true },
  insurance: { type: Number, required: true },
  cancelation: { type: Number, required: true },
});

const resrvationSchema = new mongoose.Schema(
  {
    /* TEMPORARY */
    _id: { type: String, required: true },
    /* TEMPORARY */
    userId: { type: String, ref: "User", required: true },
    caravanId: { type: String, ref: "Carvan", required: true },
    dates: { type: reservedDatesSchema },
    price: { type: priceDetailsSchema },
    extras: { type: [String], default: [] },
    insuranceSelected: { type: String, default: "basic" },
    cancelationPolicy: { type: String, default: "basic" },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", resrvationSchema);

module.exports = Reservation;
