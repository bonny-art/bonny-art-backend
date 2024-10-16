import { registerSchema } from '../../db/models/User.js';
import validateBody from '../../middlewares/validateBody.js';
import authController from '../../controllers/auth-controler.js';
import express from 'express';
const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(registerSchema),
  authController.signup
);

export default authRouter;
