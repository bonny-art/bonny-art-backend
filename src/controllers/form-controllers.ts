import { Response, NextFunction } from 'express';
import HttpError from "../helpers/http-error.js";
import { checkSubmitFormDataRequest } from '../types/submit-form-data-types.js';
import { FormData } from '../db/models/form.schema.js';
import { sendEmail } from '../services/mail-services.js';

export const submitFormData = async (
  req: checkSubmitFormDataRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
    try {
    const { name, email, message, agreement } = req.body;
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Pattern not found in request');
    }

    const newFormData = await FormData.create({
      name,
      email,
      message,
      agreement,
      status: 'new',
    });

    await sendEmail(email, null, 'newMessage', lang, {
      name,
      email,
      message,
      agreement,
    });

    res.status(201).json({
      message: 'Форма успішно відправлена',
      data: newFormData,
    });
  } catch (error) {
    next(error);
  }
};

