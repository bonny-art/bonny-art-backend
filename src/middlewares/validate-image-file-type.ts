import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import HttpError from '../helpers/http-error.js';

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/psd',
  'image/webp',
  'image/avif',
];

export const validateImageFileType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(HttpError(400, 'File not found'));
  }

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(`Error deleting unsupported file: ${err}`);
      }
    });
    return next(
      HttpError(
        400,
        'Only image files (JPEG, PNG, PSD, WebP, AVIF) are allowed.'
      )
    );
  }
  next();
};
