import { NextFunction } from 'express';
import { Document, Error as MongooseError } from 'mongoose';

interface MongoServerError extends MongooseError {
  code?: number;
  status?: number;
}

interface IPreUpdateDocument extends Document {
  setOptions: (options: { new: boolean; runValidators: boolean }) => void;
}

export const handleSaveError = (
  error: MongoServerError,
  next: NextFunction
) => {
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
};

export const preUpdate = function (
  this: IPreUpdateDocument,
  next: NextFunction
) {
  this.setOptions({ new: true, runValidators: true });
  next();
};
