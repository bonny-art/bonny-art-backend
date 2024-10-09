import express from 'express';
import * as patternControllers from '../../controllers/pattern-controllers.js';

export const patternRouter = express.Router({ mergeParams: true });

patternRouter.get('/', patternControllers.getAllPatterns);
patternRouter.get('/:patternId', patternControllers.getPhotosByPattern);
