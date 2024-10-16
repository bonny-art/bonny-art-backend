import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import HttError from '../helpers/http-error.js';

// This hellpers validate body according to the scheme
const validateBody = (schema: ObjectSchema) => {
  const func = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const fieldName = error.details[0].path;
      return next(HttError(400, `${fieldName} is not valid`));
    }
    next();
  };
  return func;
};

export default validateBody;
