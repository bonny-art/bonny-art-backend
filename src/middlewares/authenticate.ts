import jwt, { JwtPayload } from 'jsonwebtoken';
import HttpError from '../helpers/http-error.js';
import User from '../db/models/User.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { Response, NextFunction } from 'express';
import 'dotenv/config';
import { AuthenticatedRequest } from '../types/common-types.js';

const { JWT_SECRET } = process.env;

const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization || authorization === '') {
    throw HttpError(401, 'Not authorized');
  }
  if (!JWT_SECRET) {
    throw HttpError(401, 'Not authorized');
  }
  const [bearer, token] = authorization.split(' ');
  if (!token) {
    throw HttpError(401, 'Not authorized');
  }
  if (bearer !== 'Bearer') {
    throw HttpError(401, 'Not authorized');
  }
  const { id } = jwt.verify(token, JWT_SECRET) as JwtPayload | { id: string };
  const user = await User.findById(id);
  if (!user || !user.token || user.token !== token) {
    throw HttpError(401, 'Not authorized');
  }
  req.user = {
    _id: user._id.toString(),
    token: user.token,
    email: user.email,
    userName: user.userName,
  };
  next();
};

export default ctrlWrapper(authenticate);
