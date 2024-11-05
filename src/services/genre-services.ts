import { Genre } from '../db/models/Genre.js';

export const getGenreById = async (genreId: string) => {
  const genre = await Genre.findById(genreId);

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
