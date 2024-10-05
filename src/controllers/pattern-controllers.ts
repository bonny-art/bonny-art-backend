import { Request, Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import { GetAllPatternsRequest } from '@/types/patterns-type.js';

export const getAllPatterns = async (
  req: GetAllPatternsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const language = req.query.language || 'uk';
    const allPatterns = await patternServices.getAllPatterns(language);

    res.send(allPatterns);
  } catch (error) {
    next(error);
  }
};

export const getPattern = async (
  req: Request<{ patternId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patternId } = req.params;

    console.log(patternId);
    const pattern = await patternServices.getPatternById(patternId);
    console.log('hhhhhhhhhhhhhhh', pattern);
    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found' });
      return;
    }

    res.send(pattern);
  } catch (error) {
    next(error);
  }
};
