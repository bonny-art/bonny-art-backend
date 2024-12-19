import { sendMail } from './send-mail-services.js';
import {
  getPasswordRecoveryEmailContent,
  getEmailVerificationEmailContent,
} from '../helpers/mail-templates.js';

type EmailType = 'verification' | 'passwordReset' ;

export const sendEmail = async (
  to: string,
  token: string,
  type: EmailType,
  language: string = 'uk',
) => {
  let emailContent;

  if (type === 'verification') {
    if (!token) {
      throw new Error('Verification token is required');
    }
    emailContent = getEmailVerificationEmailContent(token, language);
  } else if (type === 'passwordReset') {
    if (!token) {
      throw new Error('Verification token is required');
    }
    emailContent = getPasswordRecoveryEmailContent(token, language);
  }  else {
    throw new Error('Invalid email type');
  }

  const { subject, html, text } = emailContent;
  await sendMail(to, subject, html, text);
};
