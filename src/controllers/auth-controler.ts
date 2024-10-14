import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../db/models/User.js';
import HttpError from '../helpers/http-error.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { nanoid } from 'nanoid';
import { Request, Response } from 'express';

const { JWT_SECRET } = process.env;

const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email already exist');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    email,
    password: hashPassword,
    name,
    verificationToken,
  });

  const payload = {
    id: newUser._id,
  };

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  await User.findByIdAndUpdate(
    newUser._id,
    { token },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    user: {
      email: newUser.email,
      name: newUser.name,
    },
    token,
  });
};

export default {
  signup: ctrlWrapper(signup),
};
