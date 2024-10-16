import { Payload } from '../types/user-types';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const generateToken = (payload: Payload): string => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  return token;
};
