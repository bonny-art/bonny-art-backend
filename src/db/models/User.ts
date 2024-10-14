import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError } from './hooks.js';
import { IUser } from '../../types/user-types.js';
import { emailRegexp } from '../../helpers/data-regexps.js';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: '',
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
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
  }),
  password: Joi.string().min(8).max(48).required(),
});
