import { Schema, model, Types } from 'mongoose';

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'user', required: true }, // ID клиента
    items: [
      {
        patternId: { type: Types.ObjectId, ref: 'Pattern', required: true }, // ID схемы
        canvasCount: { type: Number, min: 14, max: 28, required: true }, // Каунт канвы
      },
    ],
    comment: { type: String, default: null }, // Комментарий
    contactInfo: {
      phone: { type: String, default: null }, // Телефон (необязательно)
      instagram: { type: String, default: null }, // Instagram (необязательно)
      facebook: { type: String, default: null }, // Facebook (необязательно)
    },
    status: { type: String, default: 'created', enum: ['created', 'processing', 'completed'] }, // Статус заказа
    notes: { type: String, default: '' }, // Примечания
  },
  { timestamps: true } // Дата создания и обновления
);

export const Order = model('Order', orderSchema);
