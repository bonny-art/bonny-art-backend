import { extractPatternDetails } from './data-extractors.js';
import { PatternDoc } from '../types/patterns-type.js';
import { canvasTranslations, originTranslations } from './data-mappers.js';
import { PhotoExtendedByWorkExtendedByMaster } from '../types/work-photos-types.js';
import { Language } from '../types/common-types.js';

export const getPatternDataByLanguage = (
  pattern: PatternDoc,
  language: Language
) => {
  if (pattern) {
    // console.log('🚀 ~ pattern:', JSON.stringify(pattern, null, 2));
    const { width, height, patternType } = extractPatternDetails(
      pattern.codename
    );

    const translatedOrigin = originTranslations[pattern.origin]
      ? originTranslations[pattern.origin][language]
      : pattern.origin;

    return {
      id: pattern._id.toString(),
      title: pattern.title?.[language],
      codename: pattern.codename,
      origin: translatedOrigin,
      author: pattern.author?.[language],
      width,
      height,
      colors: pattern.solids + pattern.blends,
      solids: pattern.solids,
      blends: pattern.blends,
      mainPictureUrl: pattern?.pictures?.main?.url || '',
      mainPatternUrl: pattern?.pictures?.pattern?.url?.[language] || '',
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
    const translatedOrigin = originTranslations[pattern.origin]
      ? originTranslations[pattern.origin][language]
      : pattern.origin;

    //todo: add author in return
    return {
      id: pattern._id.toString(),
      title: pattern.title[language],
      codename: pattern.codename,
      width: pattern.width,
      height: pattern.height,
      colors: pattern.colors,
      solids: pattern.solids,
      blends: pattern.blends,
      author: pattern.author[language],
      origin: translatedOrigin,
      mainPictureUrl: pattern.pictures?.main?.url,
    };
  });
};

export const getPhotosDataByLanguage = (
  photos: PhotoExtendedByWorkExtendedByMaster[],
  language: Language
) => {
  return photos.map((photo) => {
    const translatedCanvas = canvasTranslations[photo.work.canvas]
      ? canvasTranslations[photo.work.canvas][language]
      : photo.work.canvas;

    return {
      _id: photo._id.toString(),
      masterId: photo.work.master._id.toString(),
      masterName: photo.work.master.name[language],
      review: photo.review?.[language],
      workId: photo.work._id.toString(),
      canvas: translatedCanvas,
      canvasCount: photo.work.canvasCount,
      stitchType: photo.work.stitchType,
      threadCount: photo.work.threadCount,
      threads: photo.work.threads,
      progress: photo.progress,
      imageUrl: photo.imageUrl,
      dateReceived: photo.dateReceived,
      episodeNumber: photo.episodeNumber,
      numberWithinEpisode: photo.numberWithinEpisode,
    };
  });
};
