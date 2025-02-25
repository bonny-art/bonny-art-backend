import { Request, Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
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
import { findOrCreateTitle } from '../services/pattern-title-services.js';
import { findOrCreateAuthor } from '../services/author-services.js';
import { findOrCreateGenre } from '../services/genre-services.js';
import { findOrCreateCycle } from '../services/cycle-services.js';

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

export const getAllPatternsWithPaginationAndFilters = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = req.lang;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 3;

    const {
      sizeMin,
      sizeMax,
      colorsMin,
      colorsMax,
      cycles,
      genres,
      authors,
      patternTitles,
      origins,
      sortBy,
      sortOrder,
    } = req.query;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    // 🔹 Дозволені значення для origins
    const allowedOrigins = ['painting', 'illustration', 'photo'];

    // 🔹 Дозволені значення для сортування
    const allowedSortBy = ['codename', 'title', 'rating'];
    const allowedSortOrder = ['asc', 'desc'];

    // ✅ **Перевірка origins**
    let originsArray: string[] = [];
    if (typeof origins === 'string') {
      originsArray = origins.split(',');
      if (!originsArray.every((origin) => allowedOrigins.includes(origin))) {
        throw HttpError(
          400,
          'Invalid origin value. Allowed values: painting, illustration, photo'
        );
      }
    }

    // ✅ **Перевірка sortBy**
    const sortByValue =
      typeof sortBy === 'string' && allowedSortBy.includes(sortBy)
        ? sortBy
        : 'codename';

    // ✅ **Перевірка sortOrder**
    const sortOrderValue =
      typeof sortOrder === 'string' && allowedSortOrder.includes(sortOrder)
        ? sortOrder
        : 'asc';

    // ✅ **Формування об'єкта фільтрів**
    const filters = {
      sizeMin: sizeMin ? Number(sizeMin) : null,
      sizeMax: sizeMax ? Number(sizeMax) : null,
      colorsMin: colorsMin ? Number(colorsMin) : null,
      colorsMax: colorsMax ? Number(colorsMax) : null,
      cycles: typeof cycles === 'string' ? cycles.split(',') : [],
      genres: typeof genres === 'string' ? genres.split(',') : [],
      authors: typeof authors === 'string' ? authors.split(',') : [],
      patternTitles:
        typeof patternTitles === 'string' ? patternTitles.split(',') : [],
      origins: originsArray,
      sortBy: sortByValue, //TODO: Don`t work (title)
      sortOrder: sortOrderValue as 'asc' | 'desc',
    };

    const { patterns, totalCount } =
      await patternServices.getAllPatternsByPageAndFilter(
        page,
        limit,
        filters,
        lang
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

    if (
      !codename ||
      !title ||
      !author ||
      !genre ||
      !solids ||
      !blends ||
      !origin ||
      !pictures?.main?.url ||
      !pictures?.pattern?.url?.uk ||
      !pictures?.pattern?.url?.en
    ) {
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
    const colors = solids + blends;

    const existingPattern =
      await patternServices.getPatternByCodename(codename);

    if (existingPattern) {
      throw HttpError(409, 'A pattern with the same codename already exists');
    }

    const titleId = await findOrCreateTitle(title);
    const authorId = await findOrCreateAuthor(author);
    const genreId = await findOrCreateGenre(genre);
    const cycleId = await findOrCreateCycle(cycle);

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
      title: titleId,
      author: authorId,
      origin,
      genre: genreId,
      cycle: cycleId,
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
