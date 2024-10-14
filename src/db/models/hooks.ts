import { MongoServerError } from '@/types/messages-type';
import { NextFunction } from 'express';

export const handleSaveError = (
  error: MongoServerError,
  next: NextFunction
) => {
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
};
