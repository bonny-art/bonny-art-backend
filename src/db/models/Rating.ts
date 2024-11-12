import { Rating } from '../../types/pattern-type.js';
import { Schema, model } from 'mongoose';

const ratingSchema = new Schema<Rating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
});

export const RatingModel = model<Rating>('Rating', ratingSchema);
