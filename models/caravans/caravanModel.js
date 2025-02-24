const mongoose = require("mongoose");
const Reservation = require("../reservations/reservationModel");
const { required } = require("joi");

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

const caravanSchema = new mongoose.Schema(
  {
    carType: { type: String },
    personCapacity: {
      numOfBeds: { type: Number, required: true },
      numOfSeats: { type: Number, required: true },
      numOfSleepers: { type: Number, required: true },
    },
    licenseDetails: {
      licenseRequired: { type: String, required: true },
      licensePlateNumber: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
    },
    ownerDetails: {
      ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
      isBusiness: { type: Boolean },
      businessDetails: {
        companyName: { type: String },
        companyId: { type: String },
        phone: { type: String },
        city: { type: String },
        street: { type: String },
        email: { type: String },
      },
    },
    features: {
      kitchen: {
        hasSink: { type: Boolean },
        hasStove: { type: Boolean },
        hasMicrowave: { type: Boolean },
        hasOven: { type: Boolean },
        hasFridge: { type: Boolean },
        hasDiningTable: { type: Boolean },
        hasKitchenware: { type: Boolean },
      },
      bathroom: {
        hasToilet: { type: Boolean },
        hasIndoorShower: { type: Boolean },
        hasOutdoorShower: { type: Boolean },
      },
      vehicleProps: {
        hasFireExtinguisher: { type: Boolean },
        hasFirstAidKit: { type: Boolean },
        hasSmokeDetector: { type: Boolean },
        hasBackupCamera: { type: Boolean },
        hasBackupSensor: { type: Boolean },
        hasLevelingJack: { type: Boolean },
        hasTowHitch: { type: Boolean },
      },
      caravanProps: {
        hasTV: { type: Boolean },
        hasAC: { type: Boolean },
        hasShabbatSystem: { type: Boolean },
        hasAwning: { type: Boolean },
        hasElectricity: { type: Boolean },
        hasWaterHose: { type: Boolean },
        hasGenerator: { type: Boolean },
        hasGPS: { type: Boolean },
        hasBikeRack: { type: Boolean },
        hasLinen: { type: Boolean },
        hasSolar: { type: Boolean },
      },
    },
    kosherCaravan: { type: Boolean },
    measurements: {
      length: { type: Number },
      width: { type: Number },
      weight: { type: Number },
      licenseClass: { type: String },
      minimumAge: { type: Number },
    },
    locationDetails: {
      city: { type: String },
      street: { type: String },
      houseNumber: { type: String },
      gpsData: { type: String },
      pickupTime: { type: String },
      dropoffTime: { type: String },
    },
    listingName: { type: String },
    description: { type: String },
    priceDetails: {
      pricePerNight: { type: String },
      minimumNights: { type: String },
    },
    insuranceDetails: {
      basicIncluded: { type: Boolean },
      premiumAvailable: { type: Boolean },
      basicPricePerNight: { type: Number },
      premiumPricePerNight: { type: Number },
    },
    cancelationPolicy: {
      isCancelationPolicy: { type: Boolean },
      freeCancelWindow: { type: Number },
      cancelationFeePercent: { type: Number },
    },

    extras: {
      bbq: { isAvailable: { type: Boolean }, price: { type: Number } },
      extraLinen: { isAvailable: { type: Boolean }, price: { type: Number } },
      tent: { isAvailable: { type: Boolean }, price: { type: Number } },
      extraGas: { isAvailable: { type: Boolean }, price: { type: Number } },
      picnicSet: { isAvailable: { type: Boolean }, price: { type: Number } },
      cleaningService: {
        isAvailable: { type: Boolean },
        price: { type: Number },
      },
    },

    rating: {
      rating: { type: Number },
      numOfReviews: { type: Number },
    },
  },
  { timestamps: true }
);

const Caravan = mongoose.model("Caravan", caravanSchema);

module.exports = Caravan;
