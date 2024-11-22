import { PatternDoc } from '../types/patterns-type.js';
import {
  getLocalizedPattern,
  getPaginatedLikesForUser,
} from '../services/likeService.js';
import { checkPatternExistsRequest, Language } from '../types/common-types.js';
import { Response, NextFunction } from 'express';

export const getUserLikes = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const { total, likes } = await getPaginatedLikesForUser(
      userId,
      page,
      limit
    );
    const lang: Language = req.lang || 'en';

    const localizedLikes = await Promise.all(
      likes.map(async (like) => {
        const populatedLike = await like.populate<{ patternId: PatternDoc }>(
          'patternId'
        );
        const pattern = populatedLike.patternId;
        if (pattern) {
          return getLocalizedPattern(pattern, lang);
        }

        return undefined;
      })
    );

    const filteredLikes = localizedLikes.filter((like) => like !== undefined);

    res.send({
      total,
      page: Number(page),
      limit: Number(limit),
      data: filteredLikes,
    });
  } catch (error) {
    next(error);
  }
};
