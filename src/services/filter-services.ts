import { PatternTitle } from '../db/models/pattern-title.schema.js';
import HttpError from '../helpers/http-error.js';

export const getTitlesByLanguage = async (lang?: 'uk' | 'en') => {
  if (!lang) {
    throw HttpError(404, 'Language was not set');
  }

  const titles = await PatternTitle.find({}, `name.${lang}`);

  return titles.map((title) => ({
    _id: title._id,
    name: title.name?.[lang] || 'Unnamed',
  }));
};
