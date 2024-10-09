import { Request, Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import { GetAllPatternsRequest, PatternDb } from '@/types/patterns-type.js';

type Language = 'uk' | 'en';
const isValidLanguage = (lang: unknown): lang is Language => {
  return lang === 'uk' || lang === 'en';
};

export interface RequestWithPattern extends Request {
  pattern?: PatternDb;
}

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
  req: RequestWithPattern & { params: { language: string; patternId: string } },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { language } = req.params;
    const pattern = req.pattern;
    if (!pattern) {
     res.status(404).send({ message: 'Pattern not found in request' });
     return 
    }

    let lang: Language = 'uk';
    if (isValidLanguage(language)) {
      lang = language;
    }

    const responsePattern = await patternServices.getPattern(pattern, lang);

    res.send(responsePattern);
  } catch (error) {
    next(error);
  }
};