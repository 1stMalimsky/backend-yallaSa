const Joi = require("joi");

const userValidationSchema = Joi.object({
  _id: Joi.number().required().label("User ID"), // TEMPORARY
  isAdmin: Joi.boolean().optional().label("Is Admin"),
  fullName: Joi.string().required().min(3).max(100).label("Full Name"),
  email: Joi.string().email().required().label("Email"),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .label("Phone"), // E.164 format
  password: Joi.string().required().min(6).max(128).label("Password"),
  license: Joi.string().optional().allow("").label("License"),
  isOwner: Joi.boolean().default(false).label("Is Owner"),
  caravanIds: Joi.array()
    .items(Joi.number().label("Caravan ID")) // TEMPORARY
    .when("isOwner", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .label("Caravan IDs"),
  ownerReservations: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .label("Reservation ID")
    )
    .when("isOwner", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .label("Owner Reservations"),
  userReservations: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .label("Reservation ID")
    )
    .optional()
    .label("User Reservations"),
});

// Validation function
const validateUser = (user) => {
  return userValidationSchema.validate(user, { abortEarly: false });
};

module.exports = validateUser;
