import { Request, Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import { PatternDb } from '@/types/patterns-type.js';

export interface RequestWithPattern extends Request {
  pattern?: PatternDb;
}

export const checkPatternExists = async (
  req: RequestWithPattern,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patternId } = req.params;

    const patternDoc = await patternServices.getPatternById(patternId);

    if (!patternDoc) {
      res.status(404).send({ message: 'Pattern not found' });
      return;
    }

    const pattern = {
      ...patternDoc.toObject(),
      _id: patternDoc._id.toString(),
    } as PatternDb;

    req.pattern = pattern;
    next();
  } catch (error) {
    next(error);
  }
};
