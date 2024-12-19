import { Request } from 'express';

export type Language = 'uk' | 'en';

export interface setLanguageRequest extends Request {
  lang?: Language;
}

export interface checkSubmitContactFormDataRequest extends setLanguageRequest {
  body: {
    name: string;
    email: string;
    message: string;
    agreement: boolean;
  };
}
