import { Request, Response, NextFunction } from 'express';
import {uploadPattern} from './upload.js';
import cloudinary from '../services/cloudinary-config.js';
import fs from 'fs/promises';

export const uploadPatternImages = async (req: Request, res: Response, next: NextFunction) => {
  uploadPattern.fields([
    { name: 'imageMain', maxCount: 1 },
    { name: 'imagePatternUk', maxCount: 1 },
    { name: 'imagePatternEn', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }

    try {
      if (!req.files || typeof req.files !== 'object') {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadFile = async (file: Express.Multer.File | undefined) => {
        if (!file) return null;
        const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
          folder: 'bonny-art-patterns',
          resource_type: 'image',
          allowed_formats: ['jpg', 'png', 'webp', 'psd', 'avif' ],
        });
        await fs.unlink(file.path); 
        return cloudinaryResponse.secure_url;
      };

      const files = req.files as { [key: string]: Express.Multer.File[] };
      const mainImage = await uploadFile(files.imageMain?.[0]);
      const patternUkImage = await uploadFile(files.imagePatternUk?.[0]);
      const patternEnImage = await uploadFile(files.imagePatternEn?.[0]);

      if (!mainImage || !patternUkImage || !patternEnImage) {
        return res.status(400).json({ message: 'All three images must be uploaded' });
      }

      req.body.pictures = {
        main: { url: mainImage },
        pattern: { url: { uk: patternUkImage, en: patternEnImage } },
      };

      next();
    } catch (uploadError) {
      next(uploadError);
    }
  });
};
