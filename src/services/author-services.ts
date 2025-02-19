import { Author } from '../db/models/author.schema.js';

interface AuthorName {
  uk: string;
  en: string;
}

export const getAuthorById = async (authorId: string) => {
  const author = await Author.findById(authorId);

  return author;
};

export const getAuthorByName = async (name: string) => {
  const author = await Author.findOne({
    $or: [{ 'name.uk': name }, { 'name.en': name }],
  });

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

export const findOrCreateAuthor = async (author: AuthorName) => {
  const existingAuthor = await Author.findOne({ 'name.en': author.en });

  if (existingAuthor) {
    return existingAuthor._id;
  }

  const newAuthor = await new Author({
    name: author,
  }).save();

  return newAuthor._id;
};
