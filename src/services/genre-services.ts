import HttpError from '../helpers/http-error.js';
import { Genre } from '../db/models/genre.schema.js';

export const getGenreById = async (genreId: string) => {
  const genre = await Genre.findById(genreId);

  return genre;
};

export const getGenreByName = async (name: string) => {
  const genre = await Genre.findOne({
    $or: [{ 'name.uk': name }, { 'name.en': name }],
  });

  return genre;
};

export const createGenre = async (genreData: {
  name: {
    uk: string;
    en: string;
  };
  description?: {
    uk?: string;
    en?: string;
  };
}) => {
  const newGenre = new Genre(genreData);
  await newGenre.save();
  return newGenre;
};

export const findOrCreateGenre = async (genre: { uk: string; en: string }) => {
  if (!genre || !genre.uk || !genre.en) {
    throw HttpError(400, 'Genre data is missing or invalid');
  }

  const existingGenre = await Genre.findOne({ 'name.en': genre.en });

  if (existingGenre) {
    if (existingGenre.name && existingGenre.name.uk !== genre.uk) {
      throw HttpError(
        400,
        'Mismatch in Ukrainian genre name. Please verify the spelling.'
      );
    }
    return existingGenre._id;
  }

  const newGenre = new Genre({ name: genre });
  await newGenre.save();

  return newGenre._id;
};
