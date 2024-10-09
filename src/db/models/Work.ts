import { Schema, model } from 'mongoose';

const workSchema = new Schema({
  pattern: { type: Schema.Types.ObjectId, ref: 'Pattern', required: true },
  master: { type: Schema.Types.ObjectId, ref: 'Master', required: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  fabric: { type: String, default: null },
  fabricCount: { type: Number, default: null },
  stitchType: { type: String, default: null },
  threadCount: { type: Number, default: null },
  threads: { type: String, default: null },
});

export const Work = model('Work', workSchema, 'works');
