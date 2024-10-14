import { Language } from '../types/common-types';
import { setLanguageRequest } from '@/types/patterns-type';
import { Response, NextFunction } from 'express';

export const setLanguage = (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): void => {
  const { language } = req.params;

  const selectedLanguage: Language =
    language === 'uk' || language === 'en' ? language : 'uk';

  req.lang = selectedLanguage;

  next();
};
