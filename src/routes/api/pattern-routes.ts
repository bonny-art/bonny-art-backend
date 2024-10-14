import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';

import { checkPatternExists } from '../../middlewares/check-pattern-exists.js';
import { setLanguage } from '../../middlewares/set-language.js';

export const patternRouter = express.Router({ mergeParams: true });

patternRouter.get('/', setLanguage, patternControllers.getAllPatterns);

patternRouter.get(
  '/:patternId',
  setLanguage,
  checkPatternExists,
  patternControllers.getPatternData
);

patternRouter.get(
  '/:patternId/photos',
  setLanguage,
  checkPatternExists,
  patternControllers.getPhotosByPattern
);

// patternRouter.get('/:patternId', patternControllers.getPhotosByPattern);
