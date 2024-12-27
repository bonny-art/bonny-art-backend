import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import * as userControllers from '../../controllers/user-controllers.js';
import { setLanguage } from '../../middlewares/set-language.js';

const userRouter = express.Router({ mergeParams: true });

userRouter.get(
  '/liked-patterns',
  authenticate,
  setLanguage,
  userControllers.getUserLikedPatterns
);

userRouter.post(
  '/cart',
  authenticate,
  setLanguage,
  userControllers.addPatternToCart
);

userRouter.delete(
  '/cart',
  authenticate,
  setLanguage,
  userControllers.removePatternFromCart
);

userRouter.post(
  '/orders/checkout',
  authenticate,
  setLanguage,
  userControllers.orders
);

export default userRouter;
