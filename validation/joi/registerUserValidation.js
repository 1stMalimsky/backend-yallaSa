const Joi = require("joi");

const registerUserValidationSchema = Joi.object({
  fullName: Joi.string().required().min(3).max(100).label("Full Name"),
  email: Joi.string()
    .email({
      tlds: { allow: true },
      minDomainSegments: 2,
      allowUnicode: false,
    })
    .required()
    .messages({
      "string.email": "אנא הכנס כתובת מייל תקינה",
      "string.empty": "אנא הכנס כתובת מייל",
      "any.required": "אנא הכנס כתובת מייל",
    }),
  phone: Joi.string()
    .pattern(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
    .required()
    .label("Phone"),
  password: Joi.string().required().min(6).max(128).label("Password"),
  license: Joi.string().optional().allow("").label("License"),
});

const validateUser = (userInput) => {
  return registerUserValidationSchema.validate(userInput, {
    abortEarly: false,
  });
};

module.exports = { validateUser };
