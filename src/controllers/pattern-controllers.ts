import { Response, Request, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';

export const getAllPatterns = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allPatterns = await patternServices.getAllPatterns();

    res.send({ allPatterns });
  } catch (error) {
    next(error);
  }
};
