const Joi = require("joi");
const dayjs = require("dayjs");

const today = dayjs().unix();
const tomorrow = dayjs().add(1, "day").unix();
const maxDate = dayjs().add(1, "year").unix();

const searchValidation = Joi.object({
  start: Joi.number().min(today).max(maxDate).required(),
  end: Joi.number().min(tomorrow).max(maxDate).required(),
  page: Joi.number().integer().min(1).max(100).optional().default(1),
  limit: Joi.number().integer().min(1).max(10).optional().default(10),
});

const validateSearch = (input) => {
  return searchValidation.validate(input);
};

module.exports = { validateSearch };
