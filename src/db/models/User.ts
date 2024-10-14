import { Schema, model, Document } from 'mongoose';
import Joi from 'joi';
import { handleSaveError } from './hooks.js';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  token?: string;
}

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

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
// userSchema.pre<IUser>('findOneAndUpdate', preUpdate as any);
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
