import bcrypt from 'bcryptjs';
import User from '../db/models/User.js';
import HttpError from '../helpers/http-error.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { Request, Response } from 'express';
import { createUser, getUserByProperty } from '../services/auth-serviece.js';
import { generateToken } from '../helpers/jwt-helper.js';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    token: string;
  };
}

const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await getUserByProperty({ email: normalizedEmail });
  if (user) {
    throw HttpError(409, 'Email already exist');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser({
    email: normalizedEmail,
    password: hashPassword,
    name,
  });

  const token = generateToken({ id: newUser._id.toString() });

  await User.findByIdAndUpdate(
    newUser._id,
    { token },
    { new: true, runValidators: true }
  );

  res.status(201).send({
    user: {
      email: newUser.email,
      name: newUser.name,
    },
    token,
  });
};

const signout = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }
  const { _id } = req.user;
  await User.findByIdAndUpdate(
    _id,
    { token: '' },
    { new: true, runValidators: true }
  );
  res.status(204).json();
};

export default {
  signup: ctrlWrapper(signup),
  signout: ctrlWrapper(signout),
};
