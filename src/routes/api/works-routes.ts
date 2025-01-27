import { setLanguage } from '../../middlewares/set-language.js';
import express from 'express';
import * as worksControllers from '../../controllers/works-controllers.js';

const worksRouter = express.Router({ mergeParams: true });

worksRouter.get(
  '/random/works-photos',
  setLanguage,
  worksControllers.fetchRandomWorkPhotos
);

export default worksRouter;
