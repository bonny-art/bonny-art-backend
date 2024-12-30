import mongoose, { Types } from 'mongoose';
import { Pattern } from '../db/models/pattern.schema.js';
import { PatternDoc } from '../types/patterns-types.js';
import {Order} from '../db/models/order.Schema.js';
import { CreateOrderParams } from '../types/order-types.js';

export const createOrder = async ({
  userId,
  orderItems,
  comment,
  orderNumber,
  contactInfo,
}: CreateOrderParams) => {
  const order = await Order.create({
    user: userId,
    items: orderItems,
    comment: comment || null,
    orderNumber,
    contactInfo: {
      phone: contactInfo?.phone || null,
      instagram: contactInfo?.instagram || null,
      facebook: contactInfo?.facebook || null,
    },
  });
  return order;
};

export const getPatternForOrder = async (
  patternId: mongoose.Schema.Types.ObjectId | Types.ObjectId
) => {
  return await Pattern.findById(patternId)
    .populate('title', 'name')
    .lean<PatternDoc>();
};

