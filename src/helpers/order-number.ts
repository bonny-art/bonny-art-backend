import {Order} from '../db/models/order.Schema.js';

export const generateOrderNumber = async (): Promise<string> => {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber, 10) : 0;
  return String(lastOrderNumber + 1).padStart(6, '0');
};