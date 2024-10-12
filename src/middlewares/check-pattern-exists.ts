import { Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import {
  PatternDoc,
  checkPatternExistsRequest,
} from '../types/patterns-type.js';
import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/http-error.js';

export const checkPatternExists = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patternId } = req.params;

    if (!isValidObjectId(patternId)) {
      return next(HttpError(404, `${patternId} is not valid id`));
    }

    const pattern = await patternServices.getPatternById(patternId);

    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found' });
      return;
    }

    req.pattern = pattern as PatternDoc;

    next();
  } catch (error) {
    next(error);
  }
};
