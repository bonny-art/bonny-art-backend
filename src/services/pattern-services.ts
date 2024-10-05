import {
  FormattedPattern,
  GetAllPatternsResult,
  Language,
  PatternDb,
} from '@/types/patterns-type.js';
import { Pattern } from '../db/models/Pattern.js';

export const getAllPatterns = async (
  language: Language
): Promise<GetAllPatternsResult> => {
  const patterns: PatternDb[] = await Pattern.find({});

  const formattedPatterns: FormattedPattern[] = patterns.map((pattern) => {
    const widthHeightMatch = pattern.codename.match(/\((\d+)x(\d+)\)/);
    const width = widthHeightMatch ? parseInt(widthHeightMatch[1]) : null;
    const height = widthHeightMatch ? parseInt(widthHeightMatch[2]) : null;

    return {
      title: pattern.title[language],
      codename: pattern.codename,
      width,
      height,
      colors: pattern.solids + pattern.blends,
      solids: pattern.solids,
      blends: pattern.blends,
      author: pattern.author[language],
      origin: pattern.origin[language],
      mainPictureUrl: pattern.pictures.main.url,
    };
  });

  return { patterns: formattedPatterns };
};

export const getPatternById = async (patternId: string) => {
  // Ищем паттерн по ID
  const pattern = await Pattern.findById(patternId);

  return pattern;
};
