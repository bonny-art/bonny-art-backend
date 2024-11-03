import { sendMail } from '../services/sendMailServices.js';
import { getVerificationEmailContent } from '../helpers/mailTemplates.js';

export const sendVerificationEmail = async (
  to: string,
  verifyToken: string
) => {
  const { subject, html, text } = getVerificationEmailContent(verifyToken);
  await sendMail(to, subject, html, text);
};

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string
) => {
  const { subject, html, text } = getVerificationEmailContent(resetToken);

  await sendMail(to, subject, html, text);
};
