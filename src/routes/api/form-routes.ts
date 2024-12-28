import express from 'express';
import validateBody from '../../middlewares/validate-body.js';
import * as formControllers from '../../controllers/form-controllers.js';
import { contactFormValidationSchema } from '../../db/models/contact-form.schema.js';

const formRouter = express.Router({ mergeParams: true });

formRouter.post(
  '/',
  validateBody(contactFormValidationSchema),
  formControllers.processContactForm
);

export default formRouter;
