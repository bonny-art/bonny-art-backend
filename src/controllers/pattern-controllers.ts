import { Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import * as dataHandlers from '../helpers/data-handlers.js';
import {
  checkPatternExistsRequest,
  setLanguageRequest,
} from '../types/common-types.js';
import { SortDirection, SortPhotosBy } from '../types/common-types.js';
import HttpError from '../helpers/http-error.js';
import { addRating } from '../services/pattern-services.js';

export const getAllPatterns = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang } = req;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const patterns = await patternServices.getAllPatterns();

    const patternsData = dataHandlers.getAllPatternsDataByLanguage(
      patterns,
      lang
    );

    res.send({
      patterns: patternsData,
    });
  } catch (error) {
    next(error);
  }
};

//todo: refactor this to use filters
export const getAllPatternsWithPagination = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang } = req;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 3;

    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const { patterns, totalCount } = await patternServices.getAllPatternsByPage(
      page,
      limit
    );

    const patternsData = dataHandlers.getAllPatternsDataByLanguage(
      patterns,
      lang
    );

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    res.send({
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasMore,
      },
      patternsData,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatternData = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang, pattern } = req;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }
    if (!pattern) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const responsePattern = dataHandlers.getPatternDataByLanguage(
      pattern,
      lang
    );

    res.send({
      pattern: responsePattern,
    });
  } catch (error) {
    next(error);
  }
};

export const getPhotosByPattern = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang, pattern } = req;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 3;
    const sortBy = (req.query.sortBy as SortPhotosBy) || 'dateReceived';
    const order =
      (req.query.order as SortDirection) ||
      (sortBy === 'dateReceived' ? 'desc' : 'asc');

    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }
    if (!pattern) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const patternId = pattern._id.toString();

    const { photos, totalCount } =
      await patternServices.getPhotosByPatternWithMasterAndWorkByPageWithSorting(
        patternId,
        page,
        limit,
        sortBy,
        order,
        lang
      );

    const responsePhotos = dataHandlers.getPhotosDataByLanguage(photos, lang);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    res.send({
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasMore,
      },
      responsePhotos,
    });
  } catch (error) {
    next(error);
  }
};

export const ratePattern = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
) => {
  const { patternId } = req.params;
  const { rating } = req.body;

  try {
    const userId = req.user?._id; 
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const updatedPattern = await addRating(patternId, userId, rating);
    res.send({ averageRating: updatedPattern.averageRating });
  } catch (error) {
    next(error);
  }
};
