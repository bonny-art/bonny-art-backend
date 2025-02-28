import multer from 'multer';
import path from 'path';

const destination = path.resolve('temp');

const multerConfig = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

export const uploadAvatar = multer({
  storage: multerConfig,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadImage = multer({
  storage: multerConfig,
  limits: { fileSize: 10 * 1024 * 1024 },
});
