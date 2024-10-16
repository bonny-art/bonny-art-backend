import bcrypt from 'bcryptjs';
import User from '../db/models/User.js';
import HttpError from '../helpers/http-error.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { Request, Response } from 'express';
import { createUser, getUserByProperty } from '../services/auth-serviece.js';
import { generateToken } from '../helpers/jwt-helper.js';

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

export default {
  signup: ctrlWrapper(signup),
};
