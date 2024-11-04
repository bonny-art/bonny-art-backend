import { generatePasswordResetToken } from '../helpers/authHelpers.js';
import User from '../db/models/User.js';
import HttpError from '../helpers/http-error.js';
import {
  getUserByProperty,
  getUserByUsernameIgnoreCase,
} from '../services/auth-serviece.js';
import { IUser } from '../types/user-types.js';
import bcrypt from 'bcryptjs';

export const checkIfUserExists = async (email: string, userName: string) => {
  const existingUserByEmail = await getUserByProperty({ email });
  if (existingUserByEmail) {
    throw HttpError(409, 'Email already exists');
  }

  const existingUserByName = await getUserByUsernameIgnoreCase(userName);
  if (existingUserByName) {
    throw HttpError(409, 'Username already exists');
  }
};

export const findUserByVerifyToken = async (verifyToken: string) => {
  const user = await getUserByProperty({ verifyToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  return user;
};

export const generateAndSavePasswordResetToken = async (user: IUser) => {
  const resetToken = generatePasswordResetToken();
  user.passwordRecoveryToken = resetToken;
  await user.save();
  return resetToken;
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({ passwordRecoveryToken: token });
  if (!user) {
    throw HttpError(404, 'Invalid or expired token');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.passwordRecoveryToken = null;
  await user.save();
};
