import { Request, Response, NextFunction } from 'express';
import upload from './upload.js';
import cloudinary from '../services/cloudinary-config.js'; 
import fs from 'fs/promises';

// Middleware для загрузки до 3 изображений
export const uploadPatternImages = async (req: Request, res: Response, next: NextFunction) => {
  upload.array('images', 3)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }

    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length !== 3) {
        return res.status(400).json({ message: 'You must upload exactly 3 images' });
      }

      const uploadedImages = await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file) => {
          const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
            folder: 'bonny-art-patterns',
            format: 'jpeg',
            resource_type: 'image',
            allowed_formats: ['jpg', 'png', 'webp'],
          });

          await fs.unlink(file.path); // Удаляем временный файл после загрузки
          return cloudinaryResponse.secure_url;
        })
      );

      req.body.pictures = {
        main: { url: uploadedImages[0] },
        pattern: { url: { uk: uploadedImages[1], en: uploadedImages[2] } },
      };

      next();
    } catch (uploadError) {
      next(uploadError);
    }
  });
};
