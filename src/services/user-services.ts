// Сервіси
import * as authServices from './auth-servieces.js';

// Моделі
import User from '../db/models/user.schema.js';
import Like from '../db/models/like.schema.js';

// Хелпери
import HttpError from '../helpers/http-error.js';

// Типи
import { IUser } from '../types/user-types.js';

export const checkIfUserExists = async (email: string, userName: string) => {
  const existingUserByEmail = await authServices.getUserByProperty({ email });
  if (existingUserByEmail) {
    throw HttpError(409, 'Email already exists');
  }

  const existingUserByName =
    await authServices.getUserByUsernameIgnoreCase(userName);
  if (existingUserByName) {
    throw HttpError(409, 'Username already exists');
  }
};

export const findUserByVerifyToken = async (verifyToken: string) => {
  const user = await authServices.getUserByProperty({ verifyToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  return user;
};

export const updateUserProperty = async (
  userId: string,
  updates: Partial<IUser>
) => {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  return user;
};

export const deleteLikesByUser = async (userId: string): Promise<void> => {
  await Like.deleteMany({ userId });
};
