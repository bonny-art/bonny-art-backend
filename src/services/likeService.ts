import { PatternDoc } from '../types/patterns-type.js';
import Like from '../db/models/Like.js';

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

export const getPaginatedLikesPatternsForUser = async (
  userId: string,
  page: number,
  limit: number
) => {
  const likes = await Like.find({ userId })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate<{ patternId: PatternDoc }>('patternId')
    .lean();

  const totalLikes = await Like.countDocuments({ userId });

  return {
    total: totalLikes,
    patterns: likes.map((like) => like.patternId),
  };
};
