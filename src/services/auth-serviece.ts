import User from '../db/models/User.js';

// Создаём интерфейс для объекта запроса
interface UserQuery {
  email?: string; // Если может быть только email, либо добавьте другие возможные поля
}

// Интерфейс для создания нового пользователя
interface CreateUserData {
  email: string;
  password: string;
  name: string;
  verificationToken: string;
}

export const getUserByProperty = async (query: UserQuery) => {
  const user = await User.findOne(query);
  return user;
};

// Используем интерфейс для данных пользователя
export const createUser = async (userData: CreateUserData) => {
  const newUser = await User.create(userData);
  return newUser;
};