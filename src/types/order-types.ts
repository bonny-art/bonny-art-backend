import mongoose, { Types } from 'mongoose';

interface ContactInfo {
  phone?: string;
  instagram?: string;
  facebook?: string;
}

interface OrderItem {
  patternId: mongoose.Schema.Types.ObjectId | Types.ObjectId;
  codename: string;
  name?: string;
  canvasCount: number;
}

export interface CreateOrderParams {
  userId: mongoose.Schema.Types.ObjectId | Types.ObjectId;
  orderItems: OrderItem[];
  comment: string | null;
  orderNumber: string;
  contactInfo: ContactInfo;
}
