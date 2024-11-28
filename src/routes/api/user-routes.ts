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

export default userRouter;
