const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string()
    .regex(
      new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    )
    .required(),
  password: Joi.string()
    .regex(
      new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )
    )
    .required()
    .label("passowrd"),
}).unknown(false);

const validateLoginSchema = (userInput) => {
  return loginSchema.validate(userInput, { abortEarly: false });
};

module.exports = {
  validateLoginSchema,
};
