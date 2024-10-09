import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';
import isValidId from '../../middlewares/isValidId.js';
import { checkPatternExists } from '../../middlewares/checkPatternExists.js';

const patternRouter = express.Router({ mergeParams: true });

patternRouter.get('/', patternControllers.getAllPatterns);

patternRouter.get(
  '/:patternId',
  isValidId,
  checkPatternExists,
  patternControllers.getPattern
);

export default patternRouter;
