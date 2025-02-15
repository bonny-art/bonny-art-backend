import { PatternTitle } from '../db/models/pattern-title.schema.js';

interface Title {
  uk: string;
  en: string;
}

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

export const findOrCreateTitle = async (title: Title) => {
  const existingTitle = await PatternTitle.findOne({
    'name.uk': title.uk,
    'name.en': title.en,
  });

  if (existingTitle) {
    return existingTitle._id;
  }

  const newTitle = await new PatternTitle({
    name: {
      uk: title.uk,
      en: title.en,
    },
  }).save();

  return newTitle._id;
};
