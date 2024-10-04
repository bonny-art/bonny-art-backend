import express from 'express';

import authRoutes from './auth-routes.js';
import dataRoutes from './data-routes.js';

// import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dataRoutes', dataRoutes);

export default router;
