import { Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import * as dataHandlers from '../helpers/data-handlers.js';
import {
  checkPatternExistsRequest,
  setLanguageRequest,
} from '../types/patterns-type.js';

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

//todo: add sorting by date or by master before getting data from DB
export const getPhotosByPattern = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang, pattern } = req;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 3;

    if (!lang) {
      res.status(404).send({ message: 'Language was not set' });
      return;
    }
    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found in request' });
      return;
    }

    const patternId = pattern._id.toString();

    // const photos =
    //   await patternServices.getPhotosByPatternWithMasterAndWork(patternId);

    // const { photos, totalCount } =
    //   await patternServices.getPhotosByPatternWithMasterAndWorkByPage(
    //     patternId,
    //     page,
    //     limit
    //   );

    const { photos, totalCount } =
      await patternServices.getPhotosByPatternWithMasterAndWorkByPageWithSorting(
        patternId,
        page,
        limit,
        'master',
        'asc',
        'uk'
      );

    // const responsePhotos = dataHandlers.getPhotosDataByLanguage(photos, lang);

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
      photos,
    });
  } catch (error) {
    next(error);
  }
};
