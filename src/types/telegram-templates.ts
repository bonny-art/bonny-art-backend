import mongoose, { Types } from 'mongoose';

export type TelegramMessageType = 'newMessage' | 'newOrder';
export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export interface OrderItem {
  name?: string;
  patternId: mongoose.Schema.Types.ObjectId | Types.ObjectId;
  codename: string;
  canvasCount: number;
}

export interface ContactInfo {
  phone?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  email?: string | null;
}

export interface OrderData {
  orderNumber: string;
  user: string;
  items: OrderItem[];
  contactInfo: ContactInfo;
  comment?: string;
}
