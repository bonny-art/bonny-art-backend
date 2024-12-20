import { Types } from "mongoose";

export type TelegramMessageType = 'newMessage' | 'newOrder';
export type NewMessageData = {
  name: string;
  email: string;
  message: string;
  agreement: boolean;
};

export interface OrderItem {
  patternId: Types.ObjectId;
  canvasCount: number;
}

export interface ContactInfo {
  phone?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}

export interface OrderData {
  orderNumber: string;
  user: string;
  items: OrderItem[];
  contactInfo: ContactInfo;
}
