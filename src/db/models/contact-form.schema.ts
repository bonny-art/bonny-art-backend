import mongoose from 'mongoose';
import Joi from 'joi';
import { emailRegexp, nameRegexp } from '../../helpers/data-regexps.js';

const contactFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      match: [
        nameRegexp,
        'Name must contain only letters, spaces, hyphens, or apostrophes (e.g., John Doe)',
      ],
      unique: true,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, 'Email is required'],
    },
    message: {
      type: String,
      required: true,
      maxlength: 500, 
    },
    agreement: { type: Boolean, required: true },
    status: { type: String, default: 'new' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true }
);

export const FormData = mongoose.model('FormData', contactFormSchema);


export const contactFormValidationSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp).min(2).required().messages({
    'any.required': 'Missing required userName field',
    'string.pattern.base':
      'UserName must contain only letters, spaces, hyphens, or apostrophes  (e.g., John Doe)',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
    'string.pattern.base':
      'Email must be a valid email address (e.g., user@example.com)',
  }),
  message: Joi.string().max(500).required(),
  agreement: Joi.boolean().required(),
});
