import { PatternAgregatedDocument } from '../types/patterns-types';

export const transformPatternsFormat = (
  patterns: PatternAgregatedDocument[]
) => {
  return patterns.map((pattern) => ({
    _id: pattern._id,
    codename: pattern.codename,
    patternNumber: pattern.patternNumber,
    patternType: pattern.patternType,
    width: pattern.width,
    height: pattern.height,
    maxSize: pattern.maxSize,
    colors: pattern.colors,
    solids: pattern.solids,
    blends: pattern.blends,
    origin: pattern.origin,
    rating: pattern.rating,
    pictures: pattern.pictures,
    title: { _id: pattern.titleData._id, name: pattern.titleData.name },
    author: { _id: pattern.authorData._id, name: pattern.authorData.name },
    genre: { _id: pattern.genreData._id, name: pattern.genreData.name },
    cycle: { _id: pattern.cycleData._id, name: pattern.cycleData.name },
  }));
};
