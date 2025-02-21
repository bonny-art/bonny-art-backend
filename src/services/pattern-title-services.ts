import HttpError from '../helpers/http-error.js';
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
  if (!title || !title.uk || !title.en) {
    throw HttpError(400, 'Title data is missing or invalid');
  }

  const existingTitle = await PatternTitle.findOne({ 'name.en': title.en });

  if (existingTitle) {
    if (existingTitle.name && existingTitle.name.uk !== title.uk) {
      throw HttpError(
        400,
        'Mismatch in Ukrainian title. Please verify the spelling.'
      );
    }
    return existingTitle._id;
  }

  const newTitle = new PatternTitle({ name: title });
  await newTitle.save();

  return newTitle._id;
};
