import { Schema, model, Document } from 'mongoose';
import { Types } from 'mongoose';

interface Rating extends Document {
  userId: Types.ObjectId;
  rating: number;
}

const ratingSchema = new Schema<Rating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
});

export const RatingModel = model<Rating>('Rating', ratingSchema);
