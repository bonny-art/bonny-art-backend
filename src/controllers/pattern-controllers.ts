import { Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import {
  GetAllPatternsRequest,
  GetPhotosByPattern,
  Language,
} from '../types/patterns-type.js';

export const getAllPatterns = async (
  req: GetAllPatternsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { language } = req.params;
    const selectedLanguage: Language =
      language === 'uk' || language === 'en' ? language : 'uk';
    const allPatterns = await patternServices.getAllPatterns(selectedLanguage);

    res.send(allPatterns);
  } catch (error) {
    next(error);
  }
};

export const getPhotosByPattern = async (
  req: GetPhotosByPattern,
  res: Response
): Promise<void> => {
  try {
    const { patternId } = req.params;

    const photos = await patternServices.getPhotosWithMasterAndWork(patternId);

    res.json({ photos });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching photos for pattern', error });
  }
};
