const Joi = require("joi");

const ragQuerySchema = Joi.object({
  question: Joi.string().trim().min(1).max(8000).required(),
  topK: Joi.number().integer().min(1).max(20).optional()
});

const ragIngestSchema = Joi.object({
  text: Joi.string().trim().min(1).max(500000).required(),
  maxChars: Joi.number().integer().min(200).max(8000).optional(),
  overlap: Joi.number().integer().min(0).max(500).optional()
});

module.exports = {
  ragQuerySchema,
  ragIngestSchema
};
