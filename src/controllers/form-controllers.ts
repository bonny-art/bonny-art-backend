import { Response, NextFunction } from 'express';

import * as contactFormServices from '../services/form-services.js';
import * as telergamServices  from '../services/telegram-service.js';

import HttpError from '../helpers/http-error.js';

import { checkSubmitContactFormDataRequest } from '../types/form-types.js';


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

    await telergamServices.sendTelegramMessage('newMessage', {
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
