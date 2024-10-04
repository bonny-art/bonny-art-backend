import express from 'express';

import authRoutes from './api/auth-routes.js';
import patternRoutes from './api/pattern-routes.js';

// import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/patternRoutes', patternRoutes);

export default router;
