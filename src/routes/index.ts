import express from 'express';

import authRoutes from './api/auth-routes.js';
import { patternRouter } from './api/pattern-routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/:language/patterns', patternRouter);

export default router;
