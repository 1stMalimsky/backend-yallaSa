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

    license: {
      filename: { type: String, default: "" },
      path: { type: String, default: "" },
      contentType: { type: String, default: "" },
    },
    isOwner: {
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
  },
  { timestamps: true }
);

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
