import { Response, NextFunction } from 'express';

import HttpError from '../helpers/http-error.js';
import { setLanguageRequest } from '../types/common-types.js';
import * as workServices from '../services/works-services.js';

export const fetchRandomWorkPhotos = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const randomWorks = await workServices.getRandomWorkPhotos(3, lang);

    res.send({ patterns: randomWorks });
  } catch (error) {
    console.error('Error in fetchRandomPatterns:', error);
    next(error);
  }
};
