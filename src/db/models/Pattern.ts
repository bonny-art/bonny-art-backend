import { Schema, model } from 'mongoose';
import { genreTranslations } from '../../helpers/data-mappers.js';
import { PatternSh } from '../../types/pattern-type.js';

const patternSchema = new Schema<PatternSh>({
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
  origin: { type: String, required: true },
  genre: [
    { type: String, enum: Object.keys(genreTranslations), required: true },
  ],
  rating: {
    averageRating: { type: Number, default: 0 },
    ratings: [
      {
        _id: false, // отключает авто-генерацию _id для элементов массива
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: { type: Number, required: true, min: 0, max: 5 },
      },
    ],
  },

  pictures: {
    main: {
      url: { type: String, required: true },
    },
    pattern: {
      url: {
        uk: { type: String, required: false }, // поставил для проверки false (изменить)
        en: { type: String, required: false }, // поставил для проверки false (изменить)
      },
    },
  },
});

export const Pattern = model('Pattern', patternSchema);
