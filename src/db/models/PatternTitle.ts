import { Schema, model } from 'mongoose';
import Joi from 'joi';

const patternTitleSchema = new Schema(
  {
    name: {
      uk: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  {
    versionKey: false,
  }
);

export const addPatternTitleSchema = Joi.object({
  name: Joi.object({
    uk: Joi.string().required().messages({
      'string.base': 'Title in Ukrainian must be a string',
      'any.required': 'Title in Ukrainian is required',
    }),
    en: Joi.string().required().messages({
      'string.base': 'Title in English must be a string',
      'any.required': 'Title in English is required',
    }),
  }).required(),
});

export const PatternTitle = model(
  'PatternTitle',
  patternTitleSchema,
  'pattern_titles'
);
