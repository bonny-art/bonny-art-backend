import { Response, NextFunction } from 'express';

import * as workServices from '../services/works-services.js';

import HttpError from '../helpers/http-error.js';

import { setLanguageRequest } from '../types/common-types.js';
import { RANDOM_REVIEWS_COUNT, RANDOM_WORKS_COUNT } from '../config/constants..js';

export const fetchRandomWorksPhotos = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const randomWorks = await workServices.getRandomWorkPhotos(RANDOM_WORKS_COUNT, lang);

    res.send({ patterns: randomWorks });
  } catch (error) {
    console.error('Error in fetchRandomPatterns:', error);
    next(error);
  }
};

export const fetchRandomReviews = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const randomReviews = await workServices.getRandomReviews(RANDOM_REVIEWS_COUNT, lang);

    res.send({ reviews: randomReviews });
  } catch (error) {
    console.error('Error in fetchRandomReviews:', error);
    next(error);
  }
};
