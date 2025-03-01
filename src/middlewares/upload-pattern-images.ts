import { Request, Response, NextFunction } from 'express';
import { uploadImage } from './upload.js';
import { uploadToCloudinary } from '../services/upload-to-cloudinary.js';
import HttpError from '../helpers/http-error.js';

const patternImageFields = [
  { name: 'imageMain', maxCount: 1 },
  { name: 'imagePatternUk', maxCount: 1 },
  { name: 'imagePatternEn', maxCount: 1 },
];

export const uploadPatternPreviewsImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadImage.fields(patternImageFields)(req, res, async (err) => {
    if (err) {
      throw HttpError(400, 'File upload error');
    }

    try {
      if (!req.files || typeof req.files !== 'object') {
        throw HttpError(400, 'No files uploaded');
      }

      if (!req.body.data) {
        throw HttpError(400, 'No data uploaded');
      }

      const files = req.files as { [key: string]: Express.Multer.File[] };
      const data = JSON.parse(req.body.data);

      const [mainImage, patternUkImage, patternEnImage] = await Promise.all([
        uploadToCloudinary(files.imageMain?.[0], 'bonny-art-patterns'),
        uploadToCloudinary(files.imagePatternUk?.[0], 'bonny-art-patterns'),
        uploadToCloudinary(files.imagePatternEn?.[0], 'bonny-art-patterns'),
      ]);

      if (!mainImage || !patternUkImage || !patternEnImage) {
        throw HttpError(400, 'All three images must be uploaded');
      }

      req.body = { ...data };
      req.body.pictures = {
        main: { url: mainImage },
        pattern: { url: { uk: patternUkImage, en: patternEnImage } },
      };

      next();
    } catch (error) {
      console.error('Image upload failed:', error);
      return next(HttpError(500, 'Image upload failed'));
    }
  });
};
