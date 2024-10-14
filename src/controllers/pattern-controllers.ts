import { Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import * as dataHandlers from '../helpers/data-handlers.js';
import {
  checkPatternExistsRequest,
  setLanguageRequest,
} from '../types/patterns-type.js';
import { SortDirection, SortPhotosBy } from '../types/common-types.js';

//todo: rfactor this to give patterns by pages
//todo: refactor this to use filters
export const getAllPatterns = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang } = req;
    if (!lang) {
      res.status(404).send({ message: 'Language was not set' });
      return;
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

export const getPatternData = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang, pattern } = req;
    if (!lang) {
      res.status(404).send({ message: 'Language was not set' });
      return;
    }
    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found in request' });
      return;
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
      res.status(404).send({ message: 'Language was not set' });
      return;
    }
    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found in request' });
      return;
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

    res.json({
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
