import express from 'express';
import { setLanguage } from '../../middlewares/set-language.js';
import validateBody from '../../middlewares/validate-body.js';
import authenticate from '../../middlewares/authenticate.js';
import * as formControllers from '../../controllers/form-controllers.js';
import { contactFormValidationSchema } from '../../db/models/contact-form.schema.js';

const formRouter = express.Router({ mergeParams: true });

formRouter.post(
  '/',
  authenticate,
  setLanguage,
  validateBody(contactFormValidationSchema),
  formControllers.submitContactFormData
);

export default formRouter;
