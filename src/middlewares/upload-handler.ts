import { Request, Response, NextFunction } from 'express';
import upload from './upload.js';
import multer from 'multer';

export const handleFileUpload = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: unknown) => {
      if (err) {
        // Если ошибка из multer
        if ((err as multer.MulterError).code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size exceeds 5 MB.' });
        }

        // Для других ошибок
        return res.status(500).json({
          message: 'File upload failed.',
          error: (err as Error).message,
        });
      }
      next();
    });
  };
};
