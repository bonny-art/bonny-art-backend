import { Schema, model } from 'mongoose';
const patternSchema = new Schema({
    codename: { type: String, required: true },
    solids: { type: Number, required: true },
    blends: { type: Number, required: true },
    title: {
        uk: { type: String, required: true },
        en: { type: String, required: true },
    },
    author: {
        uk: { type: String, required: true },
        en: { type: String, required: true },
    },
    origin: {
        uk: { type: String, required: true },
        en: { type: String, required: true },
    },
    ratings: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            rating: { type: Number, required: true, min: 0, max: 5 },
        },
    ],
    pictures: {
        main: {
            url: { type: String, required: true },
        },
        pattern: {
            url: {
                uk: { type: String, required: true },
                en: { type: String, required: true },
            },
        },
        stitchPhotos: [{ type: Schema.Types.ObjectId, ref: 'StitchPhoto' }],
    },
});
export const Pattern = model('Pattern', patternSchema);
