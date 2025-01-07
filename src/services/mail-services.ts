import { sendMail } from './send-mail-services.js';
import {
  getPasswordRecoveryEmailContent,
  getEmailVerificationEmailContent,
  getEmailChangeVerificationEmailContent,
} from '../helpers/mail-templates.js';

type EmailType = 'verification' | 'passwordReset' | 'emailChange';

export const sendEmail = async (
  to: string,
  token: string,
  type: EmailType,
  language: string = 'uk'
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
  } else if (type === 'emailChange') {
    if (!token) {
      throw new Error('Verification token is required');
    }
    emailContent = getEmailChangeVerificationEmailContent(token, language);
  } else {
    throw new Error('Invalid email type');
  }

  const { subject, html, text } = emailContent;
  await sendMail(to, subject, html, text);
};
