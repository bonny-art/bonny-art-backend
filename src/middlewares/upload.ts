// import multer from 'multer';
// import path from 'path';

// const destination = path.resolve('temp');

// const multerConfig = multer.diskStorage({
//   destination,
//   filename: (req, file, cb) => {
//     const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
//     const filename = `${uniquePrefix}_${file.originalname}`;
//     cb(null, filename);
//   },
// });

// const limits = {
//   fileSize: 5 * 1024 * 1024,
// };

// const upload = multer({
//   storage: multerConfig,
//   limits,
// });

// export default upload;

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

// Ограничение для аватарок (5 МБ)
const uploadAvatar = multer({
  storage: multerConfig,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Ограничение для паттернов (10 МБ)
const uploadPattern = multer({
  storage: multerConfig,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export { uploadAvatar, uploadPattern };
