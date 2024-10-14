import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import HttError from '../helpers/http-error.js';

// This hellpers validate body according to the scheme
const validateBody = (schema: ObjectSchema) => {
  const func = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttError(400, error.message));
    }
    next();
  };
  return func;
};

export default validateBody;
