import {
  FormattedPattern,
  GetAllPatternsResult,
  Language,
  PatternDb,
} from '@/types/patterns-type.js';
import { Pattern } from '../db/models/Pattern.js';

const extractWidthHeight = (
  codename: string
): { width: number | null; height: number | null } => {
  const widthHeightMatch = codename.match(/\((\d+)x(\d+)\)/);
  const width = widthHeightMatch ? parseInt(widthHeightMatch[1]) : null;
  const height = widthHeightMatch ? parseInt(widthHeightMatch[2]) : null;
  return { width, height };
};

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

export const getPatternById = async (patternId: string, language: Language) => {
  const pattern = await Pattern.findById(patternId);
  if (pattern) {
    const { width, height } = extractWidthHeight(pattern.codename);

    return {
      // ...pattern.toObject(),
      id: pattern._id.toString(),
      author: pattern.author?.[language],
      codename: pattern.codename,
      colors: pattern.solids + pattern.blends,
      solids: pattern.solids,
      blends: pattern.blends,
      width,
      height,
    };
  }

  return null;
};
