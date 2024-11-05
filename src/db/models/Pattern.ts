import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { addAuthorSchema } from './Author.js';
import { addGenreSchema } from './Genre.js';
import { addCycleSchema } from './Cycle.js';

const patternNumberRegex = /^[A-Za-z]?\d{3}$/;
const validPatternTypes = ['S', 'B', 'T'];

const patternSchema = new Schema({
  codename: { type: String, required: true },
  patternNumber: {
    type: String,
    required: true,
    match: [
      patternNumberRegex,
      'Number must be either 4 digits or 1 letter followed by 3 digits',
    ],
  },
  patternType: {
    type: String,
    required: true,
    enum: {
      values: validPatternTypes,
      message: 'Pattern type must be either S, B, or T',
    },
  },
  width: {
    type: Number,
    required: true,
    min: [1, 'Width must be greater than zero'],
  },
  height: {
    type: Number,
    required: true,
    min: [1, 'Height must be greater than zero'],
  },
  maxSize: {
    type: Number,
    required: true,
  },
  colors: { type: Number, required: true },
  solids: { type: Number, required: true },
  blends: { type: Number, required: true },
  title: {
    uk: { type: String, required: true },
    en: { type: String, required: true },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  origin: {
    type: String,
    required: true,
    enum: {
      values: ['painting', 'illustration', 'photo'],
      message: 'Origin must be either painting, illustration, or photo',
    },
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  },
  cycle: {
    type: Schema.Types.ObjectId,
    ref: 'Cycle',
  },
  ratings: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: { type: Number, required: true, min: 0, max: 5 },
    },
  ],
  pictures: {
    main: {
      url: { type: String, required: true },
    },
    pattern: {
      url: {
        uk: { type: String, required: true },
        en: { type: String, required: true },
      },
    },
  },
});

export const addPatternSchema = Joi.object({
  codename: Joi.string().required().messages({
    'string.base': 'Codename must be a string',
    'any.required': 'Codename is required',
  }),
  solids: Joi.number().required().messages({
    'number.base': 'Solids must be a number',
    'any.required': 'Solids are required',
  }),
  blends: Joi.number().required().messages({
    'number.base': 'Blends must be a number',
    'any.required': 'Blends are required',
  }),
  title: Joi.object({
    uk: Joi.string().required().messages({
      'string.base': 'Title in Ukrainian must be a string',
      'any.required': 'Title in Ukrainian is required',
    }),
    en: Joi.string().required().messages({
      'string.base': 'Title in English must be a string',
      'any.required': 'Title in English is required',
    }),
  }).required(),
  author: Joi.alternatives().try(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'Author must be a valid ObjectId',
        'string.pattern.base': 'Author must be a valid ObjectId',
        'any.required': 'Author is required',
      }),
    addAuthorSchema
  ),
  origin: Joi.string()
    .valid('painting', 'illustration', 'photo')
    .required()
    .messages({
      'string.base': 'Origin must be a string',
      'any.only': 'Origin must be either painting, illustration, or photo',
      'any.required': 'Origin is required',
    }),
  genre: Joi.alternatives().try(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'Genre must be a valid ObjectId',
        'string.pattern.base': 'Genre must be a valid ObjectId',
        'any.required': 'Genre is required',
      }),
    addGenreSchema
  ),
  cycle: Joi.alternatives().try(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.base': 'Cycle must be a valid ObjectId',
        'string.pattern.base': 'Cycle must be a valid ObjectId',
      }),
    addCycleSchema
  ),
  ratings: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.base': 'User ID must be a valid ObjectId',
            'string.pattern.base': 'User ID must be a valid ObjectId',
            'any.required': 'User ID is required',
          }),
        rating: Joi.number().min(0).max(5).required().messages({
          'number.base': 'Rating must be a number',
          'number.min': 'Rating must be at least 0',
          'number.max': 'Rating must be at most 5',
          'any.required': 'Rating is required',
        }),
      })
    )
    .optional(),
  pictures: Joi.object({
    main: Joi.object({
      url: Joi.string().required().messages({
        'string.base': 'Main picture URL must be a string',
        'any.required': 'Main picture URL is required',
      }),
    }).required(),
    pattern: Joi.object({
      url: Joi.object({
        uk: Joi.string().required().messages({
          'string.base': 'Pattern picture URL in Ukrainian must be a string',
          'any.required': 'Pattern picture URL in Ukrainian is required',
        }),
        en: Joi.string().required().messages({
          'string.base': 'Pattern picture URL in English must be a string',
          'any.required': 'Pattern picture URL in English is required',
        }),
      }).required(),
    }).required(),
  }).required(),
});

export const Pattern = model('Pattern', patternSchema);
