import { Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import { GetAllPatternsRequest, Language } from '@/types/patterns-type.js';

export const getAllPatterns = async (
  req: GetAllPatternsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { language } = req.params;
    const selectedLanguage: Language =
      language === 'uk' || language === 'en' ? language : 'uk';
    const allPatterns = await patternServices.getAllPatterns(selectedLanguage);

    res.send(allPatterns);
  } catch (error) {
    next(error);
  }
};
