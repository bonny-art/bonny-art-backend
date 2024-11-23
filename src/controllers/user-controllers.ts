import { checkPatternExistsRequest } from '../types/common-types.js';
import { Response, NextFunction } from 'express';
import * as dataHandlers from '../helpers/data-handlers.js';
import * as likesServices from '../services/likeService.js';
import HttpError from '../helpers/http-error.js';

export const getUserLikedPatterns = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const { lang } = req;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const { total, patterns } =
      await likesServices.getPaginatedLikedPatternsForUser(userId, page, limit);

    const patternsData = dataHandlers.getAllPatternsDataByLanguage(
      patterns,
      lang
    );
    res.send({
      total,
      page: Number(page),
      limit: Number(limit),
      data: patternsData,
    });
  } catch (error) {
    next(error);
  }
};
