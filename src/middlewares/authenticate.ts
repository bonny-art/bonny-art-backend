import jwt, { JwtPayload } from 'jsonwebtoken';
import HttpError from '../helpers/http-error.js';
import User from '../db/models/User.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    token: string;
  };
}

const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, 'Not authorized'));
  }
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(HttpError(401, 'Not authorized'));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET) as JwtPayload | { id: string };
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      return next(HttpError(401, 'Not authorized'));
    }
    req.user = {
      _id: user._id.toString(),
      token: user.token,
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return next(HttpError(401, 'Not authorized'));
  }
};

export default ctrlWrapper(authenticate);
