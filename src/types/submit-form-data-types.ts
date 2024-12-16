import { Request } from 'express';

export type Language = 'uk' | 'en';

export interface setLanguageRequest extends Request {
  lang?: Language;
}

export interface checkSubmitFormDataRequest extends setLanguageRequest {
  body: {
    name: string;
    email: string;
    message: string;
    agreement: boolean;
  };
}