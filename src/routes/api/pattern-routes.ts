import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';

import { checkPatternExists } from '../../middlewares/check-pattern-exists.js';
import { setLanguage } from '../../middlewares/set-language.js';
import { isValidId } from '../../middlewares/is-valid-id.js';

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
  '/:patternId/photos',
  isValidId,
  setLanguage,
  checkPatternExists,
  patternControllers.getPhotosByPattern
);

patternRouter.post('/:patternId/rate', patternControllers.ratePattern);

// patternRouter.get('/:patternId', patternControllers.getPhotosByPattern);
