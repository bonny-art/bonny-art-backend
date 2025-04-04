import { Schema, model } from 'mongoose';

const masterSchema = new Schema(
  {
    name: {
      uk: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  {
    versionKey: false,
  }
);

export const Master = model('Master', masterSchema);
