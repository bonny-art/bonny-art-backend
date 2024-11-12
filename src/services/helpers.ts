import HttpError from '../helpers/http-error.js';
import { sanitizeName } from '../helpers/data-formaters.js';
import * as authorServices from '../services/author-services.js';
import * as genreServices from '../services/genre-services.js';
import * as cycleServices from '../services/cycle-services.js';

type AuthorEntityData = {
  name: {
    uk: string;
    en: string;
  };
  bio?: {
    uk: string;
    en: string;
  };
};

type GenreEntityData = {
  name: {
    uk: string;
    en: string;
  };
  description?: {
    uk: string;
    en: string;
  };
};

type CycleEntityData = {
  name: {
    uk: string;
    en: string;
  };
  description?: {
    uk: string;
    en: string;
  };
};

export const findOrCreateAuthor = async (author: string | AuthorEntityData) => {
  let existingAuthor;

  if (typeof author === 'string') {
    existingAuthor = await authorServices.getAuthorById(author);
    if (!existingAuthor) {
      throw HttpError(404, 'Author not found');
    }
  } else if (typeof author === 'object') {
    existingAuthor =
      (await authorServices.getAuthorByName(sanitizeName(author.name.uk))) ||
      (await authorServices.getAuthorByName(sanitizeName(author.name.en)));

    if (!existingAuthor) {
      const newAuthorData = {
        name: {
          uk: author.name.uk,
          en: author.name.en,
        },
        bio: {
          uk: author.bio?.uk,
          en: author.bio?.en,
        },
      };

      existingAuthor = await authorServices.createAuthor(newAuthorData);
    }
  }

  return existingAuthor;
};

export const findOrCreateGenre = async (genre: string | GenreEntityData) => {
  let existingGenre;

  if (typeof genre === 'string') {
    existingGenre = await genreServices.getGenreById(genre);
    if (!existingGenre) {
      throw HttpError(404, 'Genre not found');
    }
  } else if (typeof genre === 'object') {
    existingGenre =
      (await genreServices.getGenreByName(sanitizeName(genre.name.uk))) ||
      (await genreServices.getGenreByName(sanitizeName(genre.name.en)));

    if (!existingGenre) {
      const newGenreData = {
        name: {
          uk: genre.name.uk,
          en: genre.name.en,
        },
        description: {
          uk: genre.description?.uk,
          en: genre.description?.en,
        },
      };

      existingGenre = await genreServices.createGenre(newGenreData);
    }
  }

  return existingGenre;
};

export const findOrCreateCycle = async (cycle: string | CycleEntityData) => {
  let existingCycle;

  if (typeof cycle === 'string') {
    existingCycle = await cycleServices.getCycleById(cycle);
    if (!existingCycle) {
      throw HttpError(404, 'Cycle not found');
    }
  } else if (typeof cycle === 'object') {
    existingCycle =
      (await cycleServices.getCycleByName(sanitizeName(cycle.name.uk))) ||
      (await cycleServices.getCycleByName(sanitizeName(cycle.name.en)));

    if (!existingCycle) {
      const newCycleData = {
        name: {
          uk: cycle.name.uk,
          en: cycle.name.en,
        },
        description: {
          uk: cycle.description?.uk,
          en: cycle.description?.en,
        },
      };

      existingCycle = await cycleServices.createCycle(newCycleData);

      if (!existingCycle) {
        throw HttpError(404, 'Cycle not found or could not be created');
      }
    }
  }

  return existingCycle;
};
