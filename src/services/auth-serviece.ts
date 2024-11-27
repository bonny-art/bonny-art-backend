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

export const deleteRatingsByUser = async (userId: string): Promise<void> => {
  await Pattern.updateMany(
    { 'rating.ratings.userId': userId }, // Найти паттерны с рейтингами от этого пользователя
    {
      $pull: { 'rating.ratings': { userId } }, // Удалить элементы с userId
    }
  );
};

export const recalculateAverageRating = async (
  patternId: string
): Promise<void> => {
  const pattern = await Pattern.findById(patternId);

  if (!pattern || !pattern.rating) return;

  const totalRating = pattern.rating.ratings.reduce(
    (acc, r) => acc + r.rating,
    0
  );
  
  const averageRating = pattern.rating.ratings.length
    ? totalRating / pattern.rating.ratings.length
    : 0;

  pattern.rating.averageRating = parseFloat(averageRating.toFixed(1));
  await pattern.save();
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
