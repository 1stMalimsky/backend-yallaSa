const Joi = require("joi");

/* EDIT USER    */

const editUserValidation = Joi.object({
  /* TEMPORARY */
  _id: Joi.number().required().label("User ID"),
  // TEMPORARY
  isAdmin: Joi.boolean().optional().label("Is Admin"),
  fullName: Joi.string().min(3).max(100).label("Full Name"),
  email: Joi.string().email().label("Email"),
  phone: Joi.string()
    .pattern(new RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/))
    .label("Phone"),
});

const validateUser = (user) => {
  return editUserValidation.validate(user, { abortEarly: false });
};

/*  EDIT CARAVAN */

const imageSchema = Joi.object({
  imgNumber: Joi.number().required().label("Image Number"),
  original: Joi.string().uri().required().label("Original Image URL"),
  thumbnail: Joi.string().uri().required().label("Thumbnail Image URL"),
  alt: Joi.string().optional().label("Alt Text"),
});

const caravanValidationSchema = Joi.object({
  ownerId: Joi.number().required().label("Owner ID"), // TEMPORARY
  // ownerId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required().label("Owner ID"),
  model: Joi.string().required().min(1).max(100).label("Model"),
  description: Joi.string().required().max(500).label("Description"),
  pricePerNight: Joi.number().required().min(1).label("Price Per Night"),
  numOfBeds: Joi.number().optional().min(1).label("Number of Beds"),
  numOfSeats: Joi.number().optional().min(1).label("Number of Seats"),

  caravanProps: Joi.object({
    hasTV: Joi.object({
      isAvailable: Joi.boolean().required().label("Has TV Available"),
      price: Joi.number().min(0).required().label("TV Price"),
    }).required(),

    hasAc: Joi.object({
      isAvailable: Joi.boolean().required().label("Has AC Available"),
      price: Joi.number().min(0).required().label("AC Price"),
    }).required(),

    hasShabbatSystem: Joi.object({
      isAvailable: Joi.boolean()
        .required()
        .label("Has Shabbat System Available"),
      price: Joi.number().min(0).required().label("Shabbat System Price"),
    }).required(),

    hasAwning: Joi.object({
      isAvailable: Joi.boolean().required().label("Has Awning Available"),
      price: Joi.number().min(0).required().label("Awning Price"),
    }).required(),

    hasElectricity: Joi.object({
      isAvailable: Joi.boolean().required().label("Has Electricity Available"),
      price: Joi.number().min(0).required().label("Electricity Price"),
    }).required(),

    hasWaterHose: Joi.object({
      isAvailable: Joi.boolean().required().label("Has Water Hose Available"),
      price: Joi.number().min(0).required().label("Water Hose Price"),
    }).required(),

    hasGenerator: Joi.object({
      isAvailable: Joi.boolean().required().label("Has Generator Available"),
      price: Joi.number().min(0).required().label("Generator Price"),
    }).required(),

    hasGPS: Joi.object({
      isAvailable: Joi.boolean().required().label("Has GPS Available"),
      price: Joi.number().min(0).required().label("GPS Price"),
    }).required(),

    hasBikeRack: Joi.object({
      isAvailable: Joi.boolean().required().label("Has Bike Rack Available"),
      price: Joi.number().min(0).required().label("Bike Rack Price"),
    }).required(),

    hasLinen: Joi.object({
      isAvailable: Joi.boolean().required().label("Has Linen Available"),
      price: Joi.number().min(0).required().label("Linen Price"),
    }).required(),

    hasSolar: Joi.object({
      isAvailable: Joi.boolean().required().label("Has Solar Available"),
      price: Joi.number().min(0).required().label("Solar Price"),
    }).required(),
  })
    .required()
    .label("Caravan Properties"),

  locationDetails: Joi.object({
    city: Joi.string().optional().max(100).label("City"),
    street: Joi.string().optional().max(100).label("Street"),
    gpsData: Joi.array()
      .items(Joi.number().min(-180).max(180))
      .length(2)
      .optional()
      .label("GPS Data"),
  })
    .optional()
    .label("Location Details"),
});

const validateCaravan = (caravanInput) =>
  caravanValidationSchema.validate(caravanInput, { abortEarly: false });

const validateImage = (image) => {
  return imageSchema.validate(image, { abortEarly: false });
};
module.exports = { validateUser, validateCaravan, validateImage };
