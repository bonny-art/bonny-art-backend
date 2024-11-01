import bcrypt from 'bcryptjs';
import User from '../db/models/User.js';
import HttpError from '../helpers/http-error.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { Request, Response } from 'express';
import {
  createUser,
  deleteUserById,
  getUserByProperty,
  getUserByUsernameIgnoreCase,
  sanitizeUserName,
  updateUserVerificationStatus,
} from '../services/auth-serviece.js';
import { generateToken } from '../helpers/jwt-helper.js';
import { AuthenticatedRequest } from '../types/common-types.js';
import { IUser } from '@/types/user-types.js';
import {
  checkIfUserExists,
  findUserByVerifyToken,
} from '../services/userService.js';
import {
  hashPassword,
  generateVerificationToken,
} from '../helpers/authHelpers.js';
import { sendVerificationEmail } from '../services/mailService.js';

const signup = async (req: Request, res: Response) => {
  const { email, password, userName } = req.body;
  const normalizedEmail = email.toLowerCase();

  const sanitizedUserName = sanitizeUserName(userName, true); // true — если разрешены пробелы

  await checkIfUserExists(normalizedEmail, sanitizedUserName);

  const hash = await hashPassword(password);
  const verifyToken = generateVerificationToken();

  const newUser = await createUser({
    email: normalizedEmail,
    password: hash,
    userName: sanitizedUserName,
    verifyToken,
  });

  await sendVerificationEmail(newUser.email, verifyToken);

  res.status(201).send({
    user: {
      email: newUser.email,
      userName: newUser.userName,
    },
  });
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await getUserByProperty({ email: normalizedEmail });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (user.verify === false) {
    throw HttpError(401, 'Your email is not verified');
  }

  const token = generateToken({ id: user._id.toString() });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    user: {
      email: user.email,
      userName: user.userName,
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

const getCurrent = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }
  const { userName, email, _id } = req.user;
  res.json({
    user: {
      _id,
      email,
      userName,
    },
  });
};

const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }

  const { _id } = req.user;
  const { userName, email, oldPassword, newPassword } = req.body;

  const updates: Partial<IUser> = {};

  if (userName) {
    updates.userName = sanitizeUserName(userName, true);
    const existingUserByName = await getUserByUsernameIgnoreCase(
      updates.userName
    );
    if (
      existingUserByName &&
      existingUserByName._id.toString() !== _id.toString()
    ) {
      throw HttpError(409, 'Username already exists');
    }
  }

  if (email) {
    const normalizedEmail = email.toLowerCase();
    const existingUserByEmail = await getUserByProperty({
      email: normalizedEmail,
    });
    if (
      existingUserByEmail &&
      existingUserByEmail._id.toString() !== _id.toString()
    ) {
      throw HttpError(409, 'Email already exists');
    }
    updates.email = normalizedEmail;
  }

  if (oldPassword || newPassword) {
    const user = req.user;

    if (oldPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw HttpError(401, 'Old password is incorrect');
      }
    } else {
      throw HttpError(400, 'Old password is required to change the password');
    }

    if (newPassword) {
      const hashPassword = await bcrypt.hash(newPassword, 10);
      updates.password = hashPassword;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(_id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    user: {
      email: updatedUser?.email,
      userName: updatedUser?.userName,
    },
  });
};

const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }
  const { _id, password: storedPassword } = req.user;
  const { password } = req.body;

  if (!password) {
    throw HttpError(400, 'Password is required for account deletion');
  }

  const isPasswordValid = await bcrypt.compare(password, storedPassword);
  if (!isPasswordValid) {
    throw HttpError(401, 'Incorrect password');
  }
  const deletedUser = await deleteUserById(_id);
  if (!deletedUser) {
    throw HttpError(404, 'User not found');
  }

  res.status(204).json();
};

const verificateUser = async (req: Request, res: Response) => {
  const { verifyToken } = req.params;

  const user = await findUserByVerifyToken(verifyToken);
  await updateUserVerificationStatus(user._id.toString());

  res.send({ message: 'Verification successful' });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  deleteUser: ctrlWrapper(deleteUser),
  verificateUser: ctrlWrapper(verificateUser),
};
