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
