import { Schema, model } from 'mongoose';

const masterSchema = new Schema({
  name: { type: String, required: true },
});

export const Master = model('Master', masterSchema);
