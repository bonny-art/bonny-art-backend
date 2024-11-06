import { sendMail } from '../services/sendMailServices.js';
import {
  getPasswordRecoveryEmailContent,
  getEmailVerificationEmailContent,
} from '../helpers/mailTemplates.js';

// export const sendVerificationEmail = async (
//   to: string,
//   verifyToken: string
// ) => {
//   const { subject, html, text } = getVerificationEmailContent(verifyToken);
//   await sendMail(to, subject, html, text);
// };

// export const sendPasswordResetEmail = async (
//   to: string,
//   resetToken: string
// ) => {
//   const { subject, html, text } = getPasswordContent(resetToken);

//   await sendMail(to, subject, html, text);
// };


type EmailType = 'verification' | 'passwordReset';

export const sendEmail = async (
  to: string,
  token: string,
  type: EmailType,
  language: string = 'uk'
) => {
  let emailContent;

  if (type === 'verification') {
    emailContent = getEmailVerificationEmailContent(token, language);
  } else if (type === 'passwordReset') {
    emailContent = getPasswordRecoveryEmailContent(token, language);
  } else {
    throw new Error('Invalid email type');
  }

  const { subject, html, text } = emailContent;
  await sendMail(to, subject, html, text);
};