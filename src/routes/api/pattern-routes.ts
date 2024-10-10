import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';

import { checkPatternExists } from '../../middlewares/checkPatternExists.js';

const patternRouter = express.Router({ mergeParams: true });

patternRouter.get('/', patternControllers.getAllPatterns);

patternRouter.get(
  '/:patternId',
  checkPatternExists,
  patternControllers.getPatternData
);

export default patternRouter;
