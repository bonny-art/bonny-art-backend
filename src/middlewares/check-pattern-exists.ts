import { Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import { checkPatternExistsRequest } from '../types/common-types.js';
import { PatternDoc } from '../types/patterns-type.js';
import HttpError from '../helpers/http-error.js';

export const checkPatternExists = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patternId } = req.params;

    const pattern = await patternServices.getPatternById(patternId);

    if (!pattern) {
      throw HttpError(404, 'Pattern not found');
    }

    req.pattern = pattern as PatternDoc;

    next();
  } catch (error) {
    next(error);
  }
};
