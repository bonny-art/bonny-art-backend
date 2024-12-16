import { sendMail } from './send-mail-services.js';
import {
  getPasswordRecoveryEmailContent,
  getEmailVerificationEmailContent,
  getNewMessageEmailContent,
} from '../helpers/mail-templates.js';

type EmailType = 'verification' | 'passwordReset' | 'newMessage';
type NewMessageData = {
  name: string;
  email: string;
  message: string;
  agreement: boolean;
};

export const sendEmail = async (
  to: string,
  token: string | null,
  type: EmailType,
  language: string = 'uk',
  additionalData?: NewMessageData 
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
  } else if (type === 'newMessage' && additionalData) {
    emailContent = getNewMessageEmailContent(additionalData, language);
  }  else {
    throw new Error('Invalid email type');
  }

  const { subject, html, text } = emailContent;
  await sendMail(to, subject, html, text);
};
