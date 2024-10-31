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
const authRouter = express.Router();

authRouter.post(
  '/register',
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
authRouter.get("/verify/:verifyToken", authController.verificateUser);

export default authRouter;
