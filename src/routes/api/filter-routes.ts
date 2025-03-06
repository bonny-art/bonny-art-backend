import express from 'express';
import { setLanguage } from '../../middlewares/set-language.js';
import * as filterControllers from '../../controllers/filter-controllers.js';

const filtersRouter = express.Router({ mergeParams: true });

filtersRouter.get('/get-titles', setLanguage, filterControllers.getTitles);
filtersRouter.get('/get-authors', setLanguage, filterControllers.getAuthors); 

export default filtersRouter;
