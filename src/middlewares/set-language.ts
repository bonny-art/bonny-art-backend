import { Response, NextFunction } from 'express';

import { Language, setLanguageRequest } from '../types/common-types.js';

export const setLanguage = (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): void => {
  const { language } = req.params;
  // console.log('xxxxxxxxxxxxxxx', language )
  const selectedLanguage: Language =
    language === 'uk' || language === 'en' ? language : 'uk';

  req.lang = selectedLanguage;

  next();
};
