import { Request, Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import { GetAllPatternsRequest } from '@/types/patterns-type.js';

type Language = 'uk' | 'en';
const isValidLanguage = (lang: unknown): lang is Language => {
  return lang === 'uk' || lang === 'en';
};

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
  req: Request<{ language: string; patternId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { language, patternId } = req.params;
    let lang: Language = 'uk';

    if (isValidLanguage(language)) {
      lang = language;
    }

    const pattern = await patternServices.getPatternById(patternId, lang);
    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found' });
      return;
    }
    res.send(pattern);
  } catch (error) {
    next(error);
  }
};
