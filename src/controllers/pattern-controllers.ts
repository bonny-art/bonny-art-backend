import { Request, Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import * as serviceHelpers from '../services/helpers.js';
import * as dataHandlers from '../helpers/data-handlers.js';
import {
  checkPatternExistsRequest,
  setLanguageRequest,
} from '../types/common-types.js';
import { SortDirection, SortPhotosBy } from '../types/common-types.js';
import HttpError from '../helpers/http-error.js';
import { addOrUpdateRating } from '../services/pattern-services.js';
import {
  countLikesForPattern,
  findLike,
  removeLike,
  addLike,
} from '../services/like-services.js';
import { Pattern } from '../db/models/pattern.schema.js';

export const getAllPatterns = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = req.lang;
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
    const lang = req.lang;
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

export const fetchRandomPatterns = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const randomPatterns = await patternServices.getRandomPatterns(3, lang);

    res.send({ patterns: randomPatterns });
  } catch (error) {
    console.error('Error in fetchRandomPatterns:', error);
    next(error);
  }
};

export const getPhotosByPattern = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const patternId = req.pattern?._id.toString();
    if (!patternId) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 3;
    const sortBy = (req.query.sortBy as SortPhotosBy) || 'dateReceived';
    const order =
      (req.query.order as SortDirection) ||
      (sortBy === 'dateReceived' ? 'desc' : 'asc');

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

export const addPattern = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      codename,
      solids,
      blends,
      title,
      author,
      origin,
      genre,
      cycle,
      pictures,
    } = req.body;

    const patternExists = await patternServices.getPatternByCodename(codename);

    if (patternExists) {
      throw HttpError(400, `Pattern with codename ${codename} already exists`);
    }

    const existingPatternTitle =
      await serviceHelpers.findOrCreatePatternTitle(title);

    if (!existingPatternTitle) {
      throw HttpError(404, 'Title not found or could not be created');
    }

    const existingAuthor = await serviceHelpers.findOrCreateAuthor(author);

    if (!existingAuthor) {
      throw HttpError(404, 'Author not found or could not be created');
    }

    const existingGenre = await serviceHelpers.findOrCreateGenre(genre);

    if (!existingGenre) {
      throw HttpError(404, 'Genre not found or could not be created');
    }

    const existingCycle = cycle
      ? await serviceHelpers.findOrCreateCycle(cycle)
      : undefined;

    const patternNumber = codename.substring(0, 4);
    const patternType = codename.charAt(6);
    const dimensions = codename.match(/\((\d+)x(\d+)\)/);

    if (!dimensions || !patternType || !patternNumber) {
      throw HttpError(400, 'Invalid codename format');
    }

    const width = parseInt(dimensions[1], 10);
    const height = parseInt(dimensions[2], 10);
    const maxSize = Math.max(width, height);
    const colors = solids + blends;

    const newPattern = await patternServices.createPattern({
      codename,
      patternNumber,
      patternType,
      width,
      height,
      maxSize,
      colors,
      solids,
      blends,
      title: existingPatternTitle._id,
      author: existingAuthor._id,
      origin,
      genre: existingGenre._id,
      cycle: existingCycle?._id || undefined,
      pictures,
    });

    res.status(201).send({ pattern: newPattern });
  } catch (error) {
    next(error);
  }
};

export const ratePattern = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const patternId = req.pattern?._id.toString();
    if (!patternId) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const userId = req.user?._id;
    if (!userId) {
      throw HttpError(401, 'User not authenticated');
    }

    const { rating } = req.body;

    const updatedPattern = await addOrUpdateRating(
      patternId,
      userId.toString(),
      rating
    );

    if (!updatedPattern) {
      throw HttpError(404, 'Pattern not found or not updated');
    }

    if (updatedPattern.rating) {
      res.send({
        userId: userId,
        patternId: patternId,
        averageRating: updatedPattern.rating.averageRating,
      });
    } else {
      throw HttpError(404, 'Pattern rating not found');
    }
  } catch (error) {
    next(error);
  }
};

export const getLikesForPattern = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patternId = req.pattern?._id.toString();
    if (!patternId) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const likeCount = await countLikesForPattern(patternId);
    res.send({ likes: likeCount });
  } catch (error) {
    next(error);
  }
};

export const toggleLikePattern = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patternId = req.pattern?._id.toString();
    if (!patternId) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const userId = req.user?._id;
    if (!userId) {
      throw HttpError(401, 'User not authenticated');
    }

    const existingLike = await findLike(patternId, userId.toString());

    if (existingLike) {
      await removeLike(existingLike._id.toString());

      res.send({ message: 'Like removed' });
    } else {
      await addLike(patternId, userId.toString());
      res.send({ message: 'Like added' });
    }
  } catch (error) {
    next(error);
  }
};

export const addPatternSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      codename,
      colors,
      solids,
      blends,
      title,
      author,
      origin,
      genre,
      cycle,
      pictures,
    } = req.body;

    if (!codename || !title || !author || !genre) {
      throw HttpError(400, 'Some required fields are missing');
    }

    const codenameMatch = codename.match(
      /^([A-Z]?\d{3}|\d{4})-([KIP][SBT]) \((\d+)x(\d+)\)$/
    );
    if (!codenameMatch) {
      throw HttpError(400, 'Codename format is invalid');
    }

    const patternNumber = codenameMatch[1];
    const patternType = codenameMatch[2][1];
    const width = parseInt(codenameMatch[3]);
    const height = parseInt(codenameMatch[4]);

    const maxSize = Math.max(width, height);

    const existingPattern = await Pattern.findOne({ codename });

    if (existingPattern) {
      throw HttpError(409, 'A pattern with the same codename already exists');
    }

    const newPattern = new Pattern({
      codename,
      patternNumber,
      patternType,
      width,
      height,
      maxSize,
      colors,
      solids,
      blends,
      title,
      author,
      origin,
      genre,
      cycle,
      pictures: {
        main: pictures.main,
        pattern: pictures.pattern,
      },
    });

    await newPattern.save();

    res.status(201).json({
      message: 'Pattern added successfully',
      pattern: newPattern,
    });
  } catch (error) {
    next(error);
  }
};
