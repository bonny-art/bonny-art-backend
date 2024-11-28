import { PatternTitle } from '../db/models/PatternTitle.js';

export const getPatternTitleById = async (patternTitleId: string) => {
  const patternTitle = await PatternTitle.findById(patternTitleId);

  return patternTitle;
};

export const getPatternTitleByName = async (name: string) => {
  const patternTitle = await PatternTitle.findOne({
    $or: [{ 'name.uk': name }, { 'name.en': name }],
  });

  return patternTitle;
};

export const createPatternTitle = async (patternTitleData: {
  name: {
    uk: string;
    en: string;
  };
}) => {
  const newPatternTitle = new PatternTitle(patternTitleData);
  await newPatternTitle.save();
  return newPatternTitle;
};
