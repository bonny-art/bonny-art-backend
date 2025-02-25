import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';

import { checkPatternExists } from '../../middlewares/check-pattern-exists.js';
import { setLanguage } from '../../middlewares/set-language.js';
import { isValidId } from '../../middlewares/is-valid-id.js';
import validateBody from '../../middlewares/validate-body.js';
import {
  addPatternSchema,
  addRatingSchema,
} from '../../db/models/pattern.schema.js';
import authenticate from '../../middlewares/authenticate.js';
import { uploadPatternImages } from '../../middlewares/upload-pattern-images.js';

export const patternRouter = express.Router({ mergeParams: true });

patternRouter.get(
  '/',
  setLanguage,
  patternControllers.getAllPatternsWithPagination
);

patternRouter.get(
  '/:patternId',
  isValidId,
  setLanguage,
  checkPatternExists,
  patternControllers.getPatternData
);

patternRouter.get(
  '/random/patterns',
  setLanguage,
  patternControllers.fetchRandomPatterns
);

patternRouter.get(
  '/:patternId/photos',
  isValidId,
  setLanguage,
  checkPatternExists,
  patternControllers.getPhotosByPattern
);

patternRouter.post(
  '/:patternId/rate',
  authenticate,
  checkPatternExists,
  validateBody(addRatingSchema),
  patternControllers.ratePattern
);

patternRouter.post(
  '/:patternId/like',
  authenticate,
  checkPatternExists,
  patternControllers.toggleLikePattern
);

patternRouter.get('/:patternId/likes', patternControllers.getLikesForPattern);

patternRouter.post(
  '/add-pattern',
  uploadPatternImages,
  validateBody(addPatternSchema),
  patternControllers.addPattern
);
