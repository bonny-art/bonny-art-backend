import { extractPatternDetails } from './data-extractors.js';
import { Language, PatternDoc } from '../types/patterns-type.js';
import { originTranslations } from './data-mappers.js';

export const getPatternDataByLanguage = (
  pattern: PatternDoc,
  language: Language
) => {
  if (pattern) {
    const { width, height, patternType } = extractPatternDetails(
      pattern.codename
    );

    return {
      id: pattern._id.toString(),
      title: pattern.title?.[language],
      codename: pattern.codename,
      origin: pattern.origin, // todo: give proper value depending on language (think if it's needed)
      author: pattern.author?.[language],
      width,
      height,
      colors: pattern.solids + pattern.blends,
      solids: pattern.solids,
      blends: pattern.blends,
      mainPictureUrl: pattern.pictures?.main?.url || '',
      mainPatternUrl: pattern.pictures?.pattern?.url?.[language] || '',
      patternType,
    };
  }

  return null;
};

export const getAllPatternsDataByLanguage = (
  patterns: PatternDoc[],
  language: Language
) => {
  return patterns.map((pattern) => {
    const { width, height, patternType } = extractPatternDetails(
      pattern.codename
    );
    const safeWidth = width ?? 0;
    const safeHeight = height ?? 0;

    const translatedOrigin = originTranslations[pattern.origin]
      ? originTranslations[pattern.origin][language]
      : pattern.origin;

    return {
      id: pattern._id.toString(),
      title: pattern.title[language],
      codename: pattern.codename,
      safeWidth,
      safeHeight,
      colors: pattern.solids + pattern.blends,
      solids: pattern.solids,
      blends: pattern.blends,
      author: pattern.author[language],
      origin: translatedOrigin,
      mainPictureUrl: pattern.pictures.main.url,
      maxSize: Math.max(safeWidth, safeHeight),
      patternType,
    };
  });
};
