import { CreateUserData, UserQuery } from '../types/user-types.js';
import User from '../db/models/User.js';

export const getUserByProperty = async (query: UserQuery) => {
  const user = await User.findOne(query);
  return user;
};

export const createUser = async (userData: CreateUserData) => {
  const newUser = await User.create(userData);
  return newUser;
};
