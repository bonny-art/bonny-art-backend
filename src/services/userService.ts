import HttpError from '../helpers/http-error.js';
import {
  getUserByProperty,
  getUserByUsernameIgnoreCase,
} from '../services/auth-serviece.js';

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
