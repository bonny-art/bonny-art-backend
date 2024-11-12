import { Schema } from 'mongoose';

export const ratingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, required: true, min: 0, max: 5 },
  },
  { _id: false }
);
