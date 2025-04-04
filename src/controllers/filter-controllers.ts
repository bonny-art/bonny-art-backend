import { Response, NextFunction } from 'express';

import * as filterServices from '../services/filter-services.js';

import HttpError from '../helpers/http-error.js';

import { setLanguageRequest } from '../types/common-types.js';

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
    const titles = await filterServices.getTitlesByLanguage(lang);

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

    const authors = await filterServices.getAuthorsByLanguage(lang);

    res.json({ authors });
  } catch (error) {
    next(error);
  }
};

export const getCycles = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const cycles = await filterServices.getCyclesByLanguage(lang);

    res.json({ cycles });
  } catch (error) {
    next(error);
  }
};

export const getGenres = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const genres = await filterServices.getGenresByLanguage(lang);

    res.json({ genres });
  } catch (error) {
    next(error);
  }
};
