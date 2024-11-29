import { Schema, model } from 'mongoose';

const workPhotoSchema = new Schema(
  {
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
    review: {
      uk: { type: String },
      en: { type: String },
    },
    progress: { type: Number },
    dateReceived: { type: Date, required: true },
    episodeNumber: { type: Number, required: true },
    numberWithinEpisode: { type: Number, required: true },
    imageUrl: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export const WorkPhoto = model('WorkPhoto', workPhotoSchema, 'work_photos');
