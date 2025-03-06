import { Response, NextFunction } from 'express';
import { setLanguageRequest } from '../types/common-types.js';
import HttpError from '../helpers/http-error.js';
import {
  getAuthorsByLanguage,
  getTitlesByLanguage,
} from '../services/filter-services.js';

export const getTitles = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }
    const titles = await getTitlesByLanguage(lang);

    res.json({ titles });
  } catch (error) {
    next(error);
  }
};

export const getAuthors = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const authors = await getAuthorsByLanguage(lang);

    res.json({ authors });
  } catch (error) {
    next(error);
  }
};
