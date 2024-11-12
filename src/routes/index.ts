import express from 'express';

import authRoutes from './api/auth-routes.js';
import { patternRouter } from './api/pattern-routes.js';
import { setLanguage } from '../middlewares/set-language.js';

const router = express.Router();

router.use('/:language', setLanguage);
router.use('/:language/auth', authRoutes);
router.use('/:language/patterns', patternRouter);

export default router;
