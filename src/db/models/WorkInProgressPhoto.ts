import { Schema, model } from 'mongoose';

const workInProgressPhotoSchema = new Schema({
  pattern: {
    type: Schema.Types.ObjectId,
    ref: 'Pattern',
    required: true,
  },
  workInProgress: {
    type: Schema.Types.ObjectId,
    ref: 'WorkInProgress',
    required: true,
  },
  progress: { type: Number, required: true },
  dateReceived: { type: Date, required: true },
  episodeNumber: { type: Number, required: true },
  numberWithinEpisode: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

export const WorkInProgressPhoto = model(
  'workInProgressPhoto',
  workInProgressPhotoSchema
);
