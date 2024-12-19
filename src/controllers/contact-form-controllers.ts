import { Response, NextFunction } from 'express';

import * as contactFormServices from '../services/contact-form-services.js';
import { sendEmail } from '../services/mail-services.js';

import HttpError from '../helpers/http-error.js';

import { checkSubmitContactFormDataRequest } from '../types/submit-contact-form-data-types.js';
import { sendTelegramMessage } from '../services/send-telegram-services.js';

export const submitContactFormData = async (
  req: checkSubmitContactFormDataRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, message, agreement } = req.body;
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const newFormData = await contactFormServices.saveFormData({
      name,
      email,
      message,
      agreement,
    });

    await sendEmail(email, null, 'newMessage', lang, {
      name,
      email,
      message,
      agreement,
    });

    await sendTelegramMessage('newMessage', lang, {
      name,
      email,
      message,
      agreement,
    });

    res.status(201).json({
      message: 'The form has been successfully submitted',
      data: newFormData,
    });
  } catch (error) {
    next(error);
  }
};
