import { Schema, model } from 'mongoose';

const masterSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export const Master = model('Master', masterSchema);
