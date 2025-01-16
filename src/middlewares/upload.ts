import multer from 'multer';
import path from 'path';

const destination = path.resolve('temp');

// const allowedMimeTypes = [
//   'image/jpeg',
//   'image/png',
//   'image/gif',
//   'image/webp',
//   'image/avif',
// ];

const multerConfig = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

// const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
//   if (!allowedMimeTypes.includes(file.mimetype)) {
//     return cb(new Error('Only image files (JPEG, PNG, WebP, AVIF) are allowed.'));
//   }
//   cb(null, true);
// };
// const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
//   if (!allowedMimeTypes.includes(file.mimetype)) {
//     const error = new Error('File type not allowed') as
//       | multer.MulterError
//       | any;
//     error.code = 'LIMIT_UNEXPECTED_FILE';
//     return cb(error, false);
//   }
//   cb(null, true);
// };

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({
  storage: multerConfig,
  limits,
  // fileFilter
});

export default upload;
