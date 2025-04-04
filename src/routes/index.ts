import express from 'express';

import authRoutes from './api/auth-routes.js';
import { patternRouter } from './api/pattern-routes.js';
import userRouter from './api/user-routes.js';
import formRouter from './api/form-routes.js';
import worksRouter from './api/works-routes.js';
import filtersRouter from './api/filter-routes.js';

const router = express.Router({ mergeParams: true });

router.use('/auth', authRoutes);
router.use('/patterns', patternRouter);
router.use('/user', userRouter);
router.use('/form', formRouter);
router.use('/works', worksRouter);
router.use('/filters', filtersRouter);

export default router;
