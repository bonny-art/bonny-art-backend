import { PatternDoc } from '../types/patterns-types.js';
import Like from '../db/models/like.schema.js';

export const countLikesForPattern = async (
  patternId: string
): Promise<number> => {
  return Like.countDocuments({ patternId });
};

export const findLike = async (patternId: string, userId: string) => {
  return Like.findOne({ patternId, userId });
};

export const removeLike = async (likeId: string): Promise<void> => {
  await Like.deleteOne({ _id: likeId });
};

export const addLike = async (
  patternId: string,
  userId: string
): Promise<void> => {
  await Like.create({ patternId, userId });
};

export const getPaginatedLikedPatternsForUser = async (
  userId: string,
  page: number,
  limit: number
) => {
  const likes = await Like.find({ userId })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate<{ patternId: PatternDoc }>({
      path: 'patternId',
      populate: [
        { path: 'title', select: 'name' },
        { path: 'author', select: 'name' },
        { path: 'genre', select: 'name' },
        { path: 'cycle', select: 'name' },
      ],
    });

  const totalLikes = await Like.countDocuments({ userId });

  return {
    total: totalLikes,
    patterns: likes.map((like) => like.patternId),
  };
};
