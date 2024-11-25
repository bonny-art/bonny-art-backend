import {
  deleteUserSchema,
  loginSchema,
  registerSchema,
  updateUserSchema,
} from '../../db/models/User.js';
import validateBody from '../../middlewares/validateBody.js';
import authController from '../../controllers/auth-controler.js';
import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import { setLanguage } from '../../middlewares/set-language.js';

const authRouter = express.Router({ mergeParams: true });

authRouter.post(
  '/register',
  setLanguage,
  validateBody(registerSchema),
  authController.signup
);
authRouter.post('/login', validateBody(loginSchema), authController.signin);
authRouter.get('/logout', authenticate, authController.signout);
authRouter.get('/user-info', authenticate, authController.getCurrent);
authRouter.patch(
  '/update',
  authenticate,
  validateBody(updateUserSchema),
  authController.updateUser
);
authRouter.delete(
  '/delete',
  authenticate,
  validateBody(deleteUserSchema),
  authController.deleteUser
);
authRouter.get('/verify/:verifyToken', authController.verificateUser);
authRouter.post('/request-password-reset', setLanguage, authController.requestPasswordReset);
authRouter.post('/reset-password/:token', authController.resetPassword);

export default authRouter;