import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);

export const generateVerificationToken = () => crypto.randomUUID();
