import crypto from 'crypto';

export const generateVerificationToken = () => {
  return crypto.randomUUID();
};
