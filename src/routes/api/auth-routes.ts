import { loginSchema, registerSchema } from '../../db/models/User.js';
import validateBody from '../../middlewares/validateBody.js';
import authController from '../../controllers/auth-controler.js';
import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(registerSchema),
  authController.signup
);
authRouter.post('/login', validateBody(loginSchema), authController.signin);
authRouter.get('/logout', authenticate, authController.signout);
authRouter.get('/user-info', authenticate, authController.getCurrent);

export default authRouter;
