import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';
import isValidId from '../../decorators/isValidId.js';

const patternRouter = express.Router();

patternRouter.get('/', patternControllers.getAllPatterns);

patternRouter.get(
  '/:language/pattern/:patternId',
  isValidId,
  patternControllers.getPattern
);

export default patternRouter;
