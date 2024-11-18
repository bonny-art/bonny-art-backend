import Like  from '../db/models/Like.js';

export const countLikesForPattern = async (patternId: string): Promise<number> => {
  return Like.countDocuments({ patternId });
};

export const findLike = async (patternId: string, userId: string) => {
  return Like.findOne({ patternId, userId });
};

export const removeLike = async (likeId: string): Promise<void> => {
  await Like.deleteOne({ _id: likeId });
};

export const addLike = async (patternId: string, userId: string): Promise<void> => {
  await Like.create({ patternId, userId });
};
