import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';

const patternRouter = express.Router();

patternRouter.get('/', patternControllers.getAllPatterns);

export default patternRouter;
