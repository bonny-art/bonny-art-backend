import express from 'express';

import authRoutes from './api/auth-routes.js';
import { patternRouter } from './api/pattern-routes.js';
import userRouter from './api/user-routes.js';
import formRouter from './api/form-routes.js';

const router = express.Router();

router.use('/:language/auth', authRoutes);
router.use('/:language/patterns', patternRouter);
router.use('/:language/user', userRouter);
router.use('/:language/form', formRouter);

export default router;
