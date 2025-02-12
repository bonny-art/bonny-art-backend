import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { addAuthorSchema } from './author.schema.js';
import { addGenreSchema } from './genre.schema.js';
import { addCycleSchema } from './cycle.schema.js';
import { addPatternTitleSchema } from './pattern-title.schema.js';
import { PatternSchemaI } from '../../types/pattern-types.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const codenameRegex =
  /^[A-Z]?\d{3}-[KIP][SBT] \(\d+x\d+\)$|^\d{4}-[KIP][SBT] \(\d+x\d+\)$/;

const patternSchema = new Schema<PatternSchemaI>(
  {
    codename: {
      type: String,
      required: true,
      match: [
        codenameRegex,
        'Codename must follow the format: A123-KB (550x416) or 0006-KB (550x416)',
      ],
    },
    patternNumber: {
      type: String,
      required: true,
      unique: true,
    },
    patternType: {
      type: String,
      required: true,
      enum: ['S', 'B', 'T'],
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
  codename: Joi.string().pattern(codenameRegex).required().messages({
    'string.base': 'Codename must be a string',
    'string.pattern.base':
      'Codename must follow the format: A123-KB (550x416) or 0006-KB (550x416)',
    'any.required': 'Codename is required',
  }),

  maxSize: Joi.number().required().messages({
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
