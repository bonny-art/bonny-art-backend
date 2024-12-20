import { ContactForm } from '../db/models/contact-form.schema.js';

interface CreateFormDataParams {
  name: string;
  email: string;
  message: string;
  agreement: boolean;
}

export const saveFormData = async (data: CreateFormDataParams) => {
  const { name, email, message, agreement } = data;

  const newFormData = await ContactForm.create({
    name,
    email,
    message,
    agreement,
    status: 'new',
  });

  return newFormData;
};
