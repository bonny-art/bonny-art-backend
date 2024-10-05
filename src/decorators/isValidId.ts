import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/http-error.js';

const isValidId = (req: Request, res: Response, next: NextFunction) => {
  const { patternId } = req.params;
  if (!isValidObjectId(patternId)) {
    return next(HttpError(404, `${patternId} is not valid id`));
  }
  next();
};

export default isValidId;
