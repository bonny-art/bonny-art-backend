import jwt, { JwtPayload } from 'jsonwebtoken';
import HttpError from '../helpers/http-error.js';
import User from '../db/models/user.schema.js';
import ctrlWrapper from '../decorators/ctrl-wrapper.js';
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

  if (!authorization || !JWT_SECRET) {
    throw HttpError(401, 'Not authorized');
  }

  const [bearer, token] = authorization.split(' ');
  if (!token || bearer !== 'Bearer') {
    throw HttpError(401, 'Not authorized');
  }

  const { id } = jwt.verify(token, JWT_SECRET) as JwtPayload | { id: string };
  const user = await User.findById(id);

  if (!user || !user.token || user.token !== token || user.verify === false) {
    throw HttpError(401, 'Not authorized');
  }
  req.user = user;
  next();
};

export default ctrlWrapper(authenticate);
