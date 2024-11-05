import { Schema, model } from 'mongoose';
import Joi from 'joi';

const cycleSchema = new Schema(
  {
    name: {
      uk: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      uk: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  {
    versionKey: false,
  }
);

export const addCycleSchema = Joi.object({
  name: Joi.object({
    uk: Joi.string().required().messages({
      'string.base': 'Name in Ukrainian must be a string',
      'any.required': 'Name in Ukrainian is required',
    }),
    en: Joi.string().required().messages({
      'string.base': 'Name in English must be a string',
      'any.required': 'Name in English is required',
    }),
  }),
  description: Joi.object({
    uk: Joi.string().required().messages({
      'string.base': 'Description in Ukrainian must be a string',
      'any.required': 'Description in Ukrainian is required',
    }),
    en: Joi.string().required().messages({
      'string.base': 'Description in English must be a string',
      'any.required': 'Description in English is required',
    }),
  }),
});

export const Cycle = model('Collection', cycleSchema);
