import { Types, Document } from 'mongoose';

export interface Rating extends Document {
  userId: Types.ObjectId;
  rating: number;
}
