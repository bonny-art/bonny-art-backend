import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

interface Payload {
  id: string;
}

export const generateToken = (payload: Payload): string => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  return token;
};
