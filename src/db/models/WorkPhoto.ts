import { Schema, model } from 'mongoose';

const workPhotoSchema = new Schema({
  pattern: {
    type: Schema.Types.ObjectId,
    ref: 'Pattern',
    required: true,
  },
  work: {
    type: Schema.Types.ObjectId,
    ref: 'Work',
    required: true,
  },
  progress: { type: Number, required: true },
  dateReceived: { type: Date, required: true },
  episodeNumber: { type: Number, required: true },
  numberWithinEpisode: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

export const WorkPhoto = model('WorkPhoto', workPhotoSchema, 'work-photos');
