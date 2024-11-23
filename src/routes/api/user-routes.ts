import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import * as userControllers from '../../controllers/user-controllers.js';

const userRouter = express.Router();

userRouter.get('/likes', authenticate, userControllers.getUserLikes);

export default userRouter;
