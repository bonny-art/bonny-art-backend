import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError } from './hooks.js';
import { IUser } from '../../types/user-types.js';
import { emailRegexp } from '../../helpers/data-regexps.js';

const nameRegexp =
  /^(?=.*[A-Za-zА-Яа-яЇїЄєІіҐґ])[A-Za-zА-Яа-яЇїЄєІіҐґ\s'-]{2,}$/;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 2,
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
      minLength: 8,
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
  name: Joi.string().pattern(nameRegexp).min(2).required().messages({
    'any.required': 'Missing required name field',
    'string.pattern.base':
      'Name must contain only letters, spaces, or hyphens (e.g., John Doe)',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
    'string.pattern.base':
      'Email must be a valid email address (e.g., user@example.com)',
  }),
  password: Joi.string().min(8).max(48).required(),
});
