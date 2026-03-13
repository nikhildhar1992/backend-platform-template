const Joi = require("joi");

/*
  Schema for creating a user
*/

const createUserSchema = Joi.object({

  name: Joi.string()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .required()

});

module.exports = {
  createUserSchema
};