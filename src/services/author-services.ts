import HttpError from '../helpers/http-error.js';
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
  if (!author || !author.uk || !author.en) {
    throw HttpError(400, 'Author data is missing or invalid');
  }

  const existingAuthor = await Author.findOne({ 'name.en': author.en });

  if (existingAuthor) {
    if (existingAuthor.name && existingAuthor.name.uk !== author.uk) {
      throw HttpError(
        400,
        'Mismatch in Ukrainian author name. Please verify the spelling.'
      );
    }
    return existingAuthor._id;
  }

  const newAuthor = new Author({ name: author });
  await newAuthor.save();

  return newAuthor._id;
};
