import { Schema, model } from 'mongoose';
const stitchPhotoSchema = new Schema({
    pattern: {
        type: Schema.Types.ObjectId,
        ref: 'Pattern',
        required: true,
    },
    master: {
        type: Schema.Types.ObjectId,
        ref: 'Master',
        required: true,
    },
    progress: { type: Number, required: true },
    dateReceived: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    episodeNumber: { type: Number, required: true },
    numberWithinEpisode: { type: Number, required: true },
});
export const StitchPhoto = model('StitchPhoto', stitchPhotoSchema);
