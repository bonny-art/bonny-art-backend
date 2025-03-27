import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import HttpError from '../helpers/http-error.js';

const validateBody = (schema: ObjectSchema) => {
  const func = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

export default validateBody;
