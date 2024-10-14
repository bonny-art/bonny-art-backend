import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/http-error.js';

export const isValidId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patternId } = req.params;

    if (patternId && !isValidObjectId(patternId)) {
      throw HttpError(404, `${patternId} is not valid id`);
    }

    next();
  } catch (error) {
    next(error);
  }
};
