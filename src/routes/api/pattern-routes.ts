import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';

const patternRouter = express.Router();

patternRouter.get('/', patternControllers.getAllPatterns);
patternRouter.get("/pattern/:patternId", patternControllers.getPattern);

export default patternRouter;
