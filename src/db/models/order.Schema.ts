import { Schema, model, Types } from 'mongoose';

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'user', required: true }, 
    items: [
      {
        patternId: { type: Types.ObjectId, ref: 'Pattern', required: true }, 
        canvasCount: { type: Number, min: 14, max: 28, required: true }, 
      },
    ],
    comment: { type: String, default: null }, 
    contactInfo: {
      phone: { type: String, default: null }, 
      instagram: { type: String, default: null },
      facebook: { type: String, default: null },
    },
    status: {
      type: String,
      default: 'created',
      enum: ['created', 'processing', 'completed'],
    }, 
    notes: { type: String, default: '' }, 
  },
  { timestamps: true } 
);

export const Order = model('Order', orderSchema);
