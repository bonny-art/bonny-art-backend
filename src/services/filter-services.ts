import { PatternTitle } from '../db/models/pattern-title.schema.js';
import { Author } from '../db/models/author.schema.js';
import { Cycle } from '../db/models/cycle.schema.js';
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

export const getAuthorsByLanguage = async (lang?: 'uk' | 'en') => {
  if (!lang) {
    throw HttpError(404, 'Language was not set');
  }

  const authors = await Author.find({}, `_id name.${lang}`);

  return authors.map((author) => ({
    _id: author._id,
    name: author.name?.[lang] || 'Unnamed',
  }));
};


export const getCyclesByLanguage = async (lang?: 'uk' | 'en') => {
  if (!lang) {
    throw HttpError(404, 'Language was not set');
  }

  const cycles = await Cycle.find({}, `_id name.${lang}`);

  return cycles.map((cycle) => ({
    _id: cycle._id,
    name: cycle.name?.[lang] || 'Unnamed',
  }));
};