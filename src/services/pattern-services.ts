import {
  FormattedPattern,
  GetAllPatternsResult,
  Language,
  PatternDb,
} from '@/types/patterns-type.js';
import { Pattern } from '../db/models/Pattern.js';
import { extractWidthHeight } from '../helpers/widthHeightExtractor.js';

export const getAllPatterns = async (
  language: Language
): Promise<GetAllPatternsResult> => {
  const patterns: PatternDb[] = await Pattern.find({});

  const formattedPatterns: FormattedPattern[] = patterns.map((pattern) => {
    const { width, height } = extractWidthHeight(pattern.codename);

    return {
      id: pattern._id.toString(),
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

export const getPattern = async (pattern: PatternDb, language: Language) => {
  if (pattern) {
    const { width, height } = extractWidthHeight(pattern.codename);

    return {
      pattern: {
        id: pattern._id.toString(),
        title: pattern.title?.[language],
        author: pattern.author?.[language],
        origin: pattern.origin?.[language],
        codename: pattern.codename,
        colors: pattern.solids + pattern.blends,
        solids: pattern.solids,
        blends: pattern.blends,
        width,
        height,
        mainPictureUrl: pattern.pictures?.main?.url || '',
        mainPatternUrl: pattern.pictures?.pattern?.url?.[language] || '',
      },
    };
  }

  return null;
};

export const getPatternById = async (patternId: string) => {
  const pattern = await Pattern.findById(patternId);
  if (!pattern) {
    return null;
  }
  return pattern;
};
