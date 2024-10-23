import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError } from './hooks.js';
import {
  IUser,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../types/user-types.js';
import { emailRegexp, nameRegexp } from '../../helpers/data-regexps.js';

const userSchema = new Schema<IUser>(
  {
    userName: {
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
    password: {
      type: String,
      minLength: PASSWORD_MIN_LENGTH,
      required: [true, 'Password is required'],
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);
userSchema.post<IUser>('save', handleSaveError);
userSchema.post<IUser>('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema);

export default User;

export const registerSchema = Joi.object({
  userName: Joi.string().pattern(nameRegexp).min(2).required().messages({
    'any.required': 'Missing required userName field',
    'string.pattern.base':
      'UserName must contain only letters, spaces, or hyphens (e.g., John Doe)',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
    'string.pattern.base':
      'Email must be a valid email address (e.g., user@example.com)',
  }),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
    'string.pattern.base':
      'Email must be a valid email address (e.g., user@example.com)',
  }),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
});

export const updateUserSchema = Joi.object({
  userName: Joi.string().pattern(nameRegexp).min(2).messages({
    'string.pattern.base':
      'UserName must contain only letters, spaces, or hyphens (e.g., John Doe)',
  }),
  email: Joi.string().pattern(emailRegexp).messages({
    'string.pattern.base':
      'Email must be a valid email address (e.g., user@example.com)',
  }),
  oldPassword: Joi.string().when('newPassword', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  newPassword: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});
