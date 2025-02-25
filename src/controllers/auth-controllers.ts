// Вбудовані модулі
import { Request, Response } from 'express';

// Зовнішні залежності
import bcrypt from 'bcryptjs';

// Сервіси
import * as authServices from '../services/auth-servieces.js';
import * as patternServices from '../services/pattern-services.js';
import * as userServices from '../services/user-services.js';
import * as dataFormatters from '../helpers/data-formaters.js';
import { sendEmail } from '../services/mail-services.js';

// Моделі
import User from '../db/models/user.schema.js';

// Хелпери
import HttpError from '../helpers/http-error.js';
import ctrlWrapper from '../decorators/ctrl-wrapper.js';
import { generateToken } from '../helpers/jwt-helper.js';
import { hashPassword, generateCryptoToken } from '../helpers/auth-helpers.js';

import { AuthenticatedRequest } from '../types/common-types.js';
import { IUser } from '../types/user-types.js';

import cloudinary from '../services/cloudinary-config.js';
import fs from 'fs';

const signup = async (req: Request & { lang?: string }, res: Response) => {
  const { email, password, userName } = req.body;
  const lang = req.lang;
  if (!lang) {
    throw HttpError(404, 'Language was not set');
  }
  const normalizedEmail = email.toLowerCase();

  const sanitizedUserName = dataFormatters.sanitizeName(userName, true); // true — если разрешены пробелы

  await userServices.checkIfUserExists(normalizedEmail, sanitizedUserName);

  const hash = await hashPassword(password);
  const verifyToken = generateCryptoToken();

  const newUser = await authServices.createUser({
    email: normalizedEmail,
    password: hash,
    userName: sanitizedUserName,
    verifyToken,
  });

  await sendEmail(newUser.email, verifyToken, 'verification', lang);

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

  const user = await authServices.getUserByProperty({ email: normalizedEmail });
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

const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, 'File not found');
  }

  const fileData = await cloudinary.uploader.upload(req.file.path, {
    folder: 'bonny-art-site-avatars',
    width: 200,
    height: 200,
    crop: 'fill',
    format: 'jpeg',
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'webp', 'avif', 'gif', 'psd'],
  });

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    }
  });

  const avatarURL = fileData.secure_url;
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

const updateUserData = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }

  const { _id } = req.user;
  const { userName } = req.body;

  const updates: Partial<IUser> = {};

  if (userName) {
    updates.userName = dataFormatters.sanitizeName(userName, true);
    const existingUserByName = await authServices.getUserByUsernameIgnoreCase(
      updates.userName
    );
    if (
      existingUserByName &&
      existingUserByName._id.toString() !== _id.toString()
    ) {
      throw HttpError(409, 'Username already exists');
    }
  }

  const updatedUser = await userServices.updateUserProperty(
    _id.toString(),
    updates
  );

  res.json({
    user: {
      userName: updatedUser?.userName,
    },
  });
};

const changeEmail = async (
  req: AuthenticatedRequest & { lang?: string },
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }

  const lang = req.lang;
  if (!lang) {
    throw HttpError(404, 'Language was not set');
  }

  const { email } = req.body;
  if (!email) {
    throw HttpError(400, 'Email is required');
  }

  const normalizedEmail = email.toLowerCase();

  const existingUserByEmail = await authServices.getUserByProperty({
    email: normalizedEmail,
  });
  if (
    existingUserByEmail &&
    existingUserByEmail._id.toString() !== req.user._id.toString()
  ) {
    throw HttpError(409, 'Email already exists');
  }

  const newVerificationToken = generateCryptoToken();

  await sendEmail(
    normalizedEmail,
    newVerificationToken,
    'emailChange',
    req.lang || 'en'
  );
  await userServices.updateUserProperty(req.user._id.toString(), {
    email: normalizedEmail,
    verify: false,
    verifyToken: newVerificationToken,
  });
  res.json({
    message: 'Verification email sent. Please verify your new email address.',
  });
};

const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw HttpError(400, 'Old and new passwords are required');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, req.user.password);
  if (!isPasswordValid) {
    throw HttpError(401, 'Old password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userServices.updateUserProperty(req.user._id.toString(), {
    password: hashedPassword,
  });

  res.json({ message: 'Password updated successfully' });
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

  await patternServices.deleteRatingsByUser(_id.toString());

  await userServices.deleteLikesByUser(_id.toString());

  res.status(204).json();
};

const verificateUser = async (req: Request, res: Response) => {
  const { verifyToken } = req.params;

  const user = await userServices.findUserByVerifyToken(verifyToken);
  await userServices.updateUserProperty(user._id.toString(), {
    verify: true,
    verifyToken: null,
  });

  res.send({ message: 'Verification successful' });
};

const requestPasswordReset = async (
  req: Request & { lang?: string },
  res: Response
) => {
  const { email } = req.body;
  const lang = req.lang;
  if (!lang) {
    throw HttpError(404, 'Language was not set');
  }
  const trimmedEmail = email.trim();

  const user = await authServices.getUserByProperty({ email: trimmedEmail });
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  const resetToken = generateCryptoToken();
  await userServices.updateUserProperty(user._id.toString(), {
    passwordRecoveryToken: resetToken,
  });
  await sendEmail(user.email, resetToken, 'passwordReset', lang);
  res.send({ message: 'Password reset email sent' });
};

const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await authServices.getUserByProperty({
    passwordRecoveryToken: token,
  });
  if (!user) {
    throw HttpError(404, 'Invalid or expired token');
  }
  const hashedPassword = await hashPassword(newPassword);
  const updatedUser = await userServices.updateUserProperty(
    user._id.toString(),
    {
      password: hashedPassword,
      passwordRecoveryToken: null,
    }
  );

  if (!updatedUser) {
    throw HttpError(404, 'User not found');
  }

  res.send({ message: 'Password has been reset successfully' });
};

const resendVerificationEmail = async (
  req: Request & { lang?: string },
  res: Response
) => {
  const { email } = req.body;
  const lang = req.lang;

  if (!email) {
    throw HttpError(400, 'Email is required');
  }
  if (!lang) {
    throw HttpError(404, 'Language was not set');
  }

  const normalizedEmail = email.toLowerCase();

  const user = await authServices.getUserByProperty({ email: normalizedEmail });
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  if (user.verify === true) {
    throw HttpError(400, 'Email is already verified');
  }

  let verifyToken = user.verifyToken;
  if (!verifyToken) {
    verifyToken = generateCryptoToken();

    await userServices.updateUserProperty(user._id.toString(), { verifyToken });
  }
  await sendEmail(user.email, verifyToken, 'verification', lang);

  res.status(200).json({
    message: 'Verification email has been resent',
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  getCurrent: ctrlWrapper(getCurrent),
  uploadAvatar: ctrlWrapper(uploadAvatar),
  updateUserData: ctrlWrapper(updateUserData),
  changePassword: ctrlWrapper(changePassword),
  changeEmail: ctrlWrapper(changeEmail),
  deleteUser: ctrlWrapper(deleteUser),
  verificateUser: ctrlWrapper(verificateUser),
  requestPasswordReset: ctrlWrapper(requestPasswordReset),
  resetPassword: ctrlWrapper(resetPassword),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
};
