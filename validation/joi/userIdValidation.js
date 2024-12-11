const Joi = require("joi");

const mongooseIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const validateId = (input) =>
  mongooseIdSchema.validate(input, { abortEarly: false });

module.exports = validateId;
