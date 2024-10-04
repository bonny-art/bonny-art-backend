import { Pattern } from '../db/models/Pattern.js';

export const getAllPatterns = async () => {
  const patterns = await Pattern.find({});

  return patterns;
};
