import cloudinary from './cloudinary-config.js';
import fs from 'fs/promises';

export const uploadToCloudinary = async (file?: Express.Multer.File) => {
  if (!file) return null;

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
      folder: 'bonny-art-patterns',
      resource_type: 'image',
      allowed_formats: ['jpg', 'png', 'webp', 'psd', 'avif'],
    });

    await fs.unlink(file.path);
    return cloudinaryResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};
