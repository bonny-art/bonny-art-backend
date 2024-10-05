import { Pattern } from '../db/models/Pattern.js';

export const getAllPatterns = async () => {
  const patterns = await Pattern.find({});

  return patterns;
};

export const getPatternById = async (patternId: string) => {
  // Ищем паттерн по ID
  const pattern = await Pattern.findById(patternId);

  return pattern;
};
