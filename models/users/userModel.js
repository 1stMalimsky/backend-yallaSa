const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    isAdmin: { type: Boolean },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    isBusiness: {
      type: Boolean,
      default: false,
    },
    caravanIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Caravan",
      },
    ],
    ownerReservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
    userReservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
    paymentDetails: {
      bankAccount: { type: String },
      bankBranch: { type: String },
      bankName: { type: String },
      phone: { type: String },
    },
    businessDetails: {
      companyName: { type: String },
      companyId: { type: String },
      email: { type: String },
      phone: { type: String },
      city: { type: String },
      street: { type: String },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isBusiness && this.businessDetails) {
    this.businessDetails = undefined; // ✅ Remove `businessDetails` if `isBusiness` is false
  }
  next();
});

userSchema.path("caravanIds").validate(function (value) {
  if (this.isOwner) {
    return Array.isArray(value);
  } else {
    return !value || value.length === 0;
  }
}, "Non-owners cannot have caravan IDs.");

userSchema.path("ownerReservations").validate(function (value) {
  if (this.isOwner) {
    return Array.isArray(value);
  } else {
    return !value || value.length === 0;
  }
}, "Non-owners cannot have ownerReservations.");

const User = mongoose.model("User", userSchema);

module.exports = User;
