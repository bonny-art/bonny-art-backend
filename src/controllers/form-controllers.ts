import { Response, NextFunction } from 'express';

import * as contactFormServices from '../services/form-services.js';
import * as telergamServices from '../services/telegram-service.js';

import HttpError from '../helpers/http-error.js';

import { checkSubmitContactFormDataRequest } from '../types/form-types.js';
import { TELEGRAM_MESSAGE_TYPES } from '../constants.js';

export const processContactForm = async (
  req: checkSubmitContactFormDataRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, message, agreement } = req.body;

    if (!agreement) {
      throw HttpError(400, 'Agreement is required');
    }

    const newFormData = await contactFormServices.saveFormData({
      name,
      email,
      message,
      agreement,
    });

    await telergamServices.buildAndSendTelegramMessage(
      TELEGRAM_MESSAGE_TYPES.NEW_MESSAGE,
      {
        name,
        email,
        message,
      }
    );

    res.status(201).json({
      message: 'The form has been successfully submitted',
      data: newFormData,
    });
  } catch (error) {
    next(error);
  }
};
