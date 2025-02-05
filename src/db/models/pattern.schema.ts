import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { addAuthorSchema } from './author.schema.js';
import { addGenreSchema } from './genre.schema.js';
import { addCycleSchema } from './cycle.schema.js';
import { addPatternTitleSchema } from './pattern-title.schema.js';
import { PatternSchemaI } from '../../types/pattern-types.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const patternNumberRegex = /^(?:[A-Za-z]\d{3}|\d{4})$/;
const validPatternTypes = ['S', 'B', 'T'];

const patternSchema = new Schema<PatternSchemaI>(
  {
    codename: { type: String, required: true },
    patternNumber: {
      type: String,
      required: true,
      unique: true,
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
      type: Schema.Types.ObjectId,
      ref: 'PatternTitle',
      required: true,
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
    rating: {
      averageRating: { type: Number, default: 0 },
      ratings: {
        type: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              ref: 'User',
              required: true,
            },
            rating: { type: Number, required: true, min: 0, max: 5 },
          },
        ],
        _id: false,
        default: [],
      },
    },
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
  },
  {
    versionKey: false,
  }
);

export const addPatternSchema = Joi.object({
  codename: Joi.string().required().messages({
    'string.base': 'Codename must be a string',
    'any.required': 'Codename is required',
  }),
  patternNumber: Joi.string()
  .pattern(patternNumberRegex)
  .required()
  .messages({
    'string.base': 'Pattern number must be a string',
    'string.pattern.base': 'Pattern number must be in the correct format (e.g., 0646 or A123)',
    'any.required': 'Pattern number is required',
  }),
  patternType: Joi.string()
  .valid('S', 'B', 'T')
  .required()
  .messages({
    'string.base': 'Pattern type must be a string',
    'any.required': 'Pattern type is required',
    'any.only': 'Pattern type must be one of "S", "B", or "T"',
  }),
  width: Joi.number()
  .required()
  .min(1)
  .messages({
    'number.base': 'Width must be a number',
    'any.required': 'Width is required',
    'number.min': 'Width must be greater than zero',
  }),
  height: Joi.number()
  .required()
  .min(1)
  .messages({
    'number.base': 'Height must be a number',
    'any.required': 'Height is required',
    'number.min': 'Height must be greater than zero',
  }),
  maxSize: Joi.number()
  .required()
  .messages({
    'number.base': 'Max size must be a number',
    'any.required': 'Max size is required',
  }),
  colors: Joi.number().required().messages({
    'number.base': 'Colors must be a number',
    'any.required': 'Colors are required',
  }),
  solids: Joi.number().required().messages({
    'number.base': 'Solids must be a number',
    'any.required': 'Solids are required',
  }),
  blends: Joi.number().required().messages({
    'number.base': 'Blends must be a number',
    'any.required': 'Blends are required',
  }),
  title: Joi.alternatives().try(
    Joi.string().pattern(objectIdRegex).required().messages({
      'string.base': 'Title must be a valid ObjectId',
      'string.pattern.base': 'Title must be a valid ObjectId',
      'any.required': 'Title is required',
    }),
    addPatternTitleSchema
  ),
  author: Joi.alternatives().try(
    Joi.string().pattern(objectIdRegex).required().messages({
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
    Joi.string().pattern(objectIdRegex).required().messages({
      'string.base': 'Genre must be a valid ObjectId',
      'string.pattern.base': 'Genre must be a valid ObjectId',
      'any.required': 'Genre is required',
    }),
    addGenreSchema
  ),
  cycle: Joi.alternatives().try(
    Joi.string().pattern(objectIdRegex).optional().messages({
      'string.base': 'Cycle must be a valid ObjectId',
      'string.pattern.base': 'Cycle must be a valid ObjectId',
    }),
    addCycleSchema
  ),
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

export const addRatingSchema = Joi.object({
  rating: Joi.number().min(0).max(5).required().messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 0',
    'number.max': 'Rating must be at most 5',
    'any.required': 'Rating is required',
  }),
});

export const Pattern = model('Pattern', patternSchema);
