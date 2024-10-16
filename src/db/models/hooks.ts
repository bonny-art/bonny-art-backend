import { MongoServerError } from '@/types/messages-type';
import { NextFunction } from 'express';

export const handleSaveError = (
  error: MongoServerError,
  next: NextFunction
) => {
  const { name, code } = error;
  if (name === 'MongoServerError' && code === 11000) {
    error.status = 409;
    error.message =
      'Conflict: This email is already in use. Please choose another one.';
  } else {
    error.status = 400;
    error.message =
      'Bad Request: There was a validation error or another issue with your input.';
  }
  next();
};
