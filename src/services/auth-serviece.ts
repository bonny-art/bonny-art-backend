import { CreateUserData, UserQuery } from '../types/user-types.js';
import User from '../db/models/User.js';
import Like from '../db/models/Like.js';
import { Pattern } from '../db/models/Pattern.js';

export const getUserByProperty = async (query: UserQuery) => {
  const user = await User.findOne(query);
  return user;
};

export const createUser = async (userData: CreateUserData) => {
  const newUser = await User.create(userData);
  return newUser;
};

export const getUserByUsernameIgnoreCase = async (userName: string) => {
  const normalizedUserName = userName.toLowerCase();
  const user = await User.findOne({
    userName: { $regex: `^${normalizedUserName}$`, $options: 'i' },
  });
  return user;
};

export const deleteUserById = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  return user;
};

export const deleteLikesByUser = async (userId: string): Promise<void> => {
  await Like.deleteMany({ userId });
};

export const updateRatingsForDeletedUser = async (userId: string): Promise<void> => {
  await Pattern.updateMany(
    { 'rating.ratings.userId': userId }, // Найти паттерны с рейтингами от этого пользователя
    { $set: { 'rating.ratings.$[elem].userId': null } }, // Установить userId в null
    { arrayFilters: [{ 'elem.userId': userId }] } // Применить изменения только к элементам с этим userId
  );
};

export const sanitizeUserName = (
  userName: string,
  allowSpaces: boolean = true
): string => {
  const trimmedName = userName.trim();
  const sanitizedName = allowSpaces
    ? trimmedName.replace(/\s+/g, ' ')
    : trimmedName.replace(/\s+/g, '');

  return sanitizedName;
};
