import {
  changeEmailSchema,
  changePasswordSchema,
  deleteUserSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  updateUserSchema,
} from '../../db/models/user.schema.js';
import validateBody from '../../middlewares/validate-body.js';
import authController from '../../controllers/auth-controllers.js';
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

authRouter.patch(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);
authRouter.patch(
  '/change-email',
  authenticate,
  setLanguage,
  validateBody(changeEmailSchema),
  authController.changeEmail
);

authRouter.delete(
  '/delete',
  authenticate,
  validateBody(deleteUserSchema),
  authController.deleteUser
);
authRouter.get('/verify/:verifyToken', authController.verificateUser);
authRouter.post(
  '/request-password-reset',
  setLanguage,
  authController.requestPasswordReset
);
authRouter.post('/reset-password/:token', authController.resetPassword);

authRouter.post(
  '/resend-verification',
  setLanguage,
  validateBody(resendVerificationSchema),
  authController.resendVerificationEmail
);

export default authRouter;
