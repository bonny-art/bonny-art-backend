import { Author } from '../db/models/Author.js';

export const getAuthorById = async (authorId: string) => {
  const author = await Author.findById(authorId);

  return author;
};

export const createAuthor = async (authorData: {
  name: {
    uk: string;
    en: string;
  };
  bio?: {
    uk?: string;
    en?: string;
  };
}) => {
  const newAuthor = new Author(authorData);
  await newAuthor.save();
  return newAuthor;
};
