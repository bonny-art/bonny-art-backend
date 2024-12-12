import { Response, NextFunction } from 'express';

import * as likesServices from '../services/like-services.js';
import * as patternServices from '../services/pattern-services.js';
import * as telegramServices from '../services/telegram-service.js';

import * as dataHandlers from '../helpers/data-handlers.js';
import * as orderNumber from '../helpers/order-number.js';

import HttpError from '../helpers/http-error.js';

import { checkPatternExistsRequest } from '../types/common-types.js';
import { Pattern } from '../db/models/pattern.schema.js';
import { Order } from '../db/models/order.Schema.js';

export const getUserLikedPatterns = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const lang = req.lang;
    if (!lang) {
      throw HttpError(404, 'Language was not set');
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const { total, patterns } =
      await likesServices.getPaginatedLikedPatternsForUser(userId, page, limit);
    console.log('🚀 ~ patterns:', JSON.stringify(patterns, null, 2));

    const patternsData = dataHandlers.getAllPatternsDataByLanguage(
      patterns,
      lang
    );
    res.send({
      total,
      page: Number(page),
      limit: Number(limit),
      data: patternsData,
    });
  } catch (error) {
    next(error);
  }
};

export const addPatternToCart = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patternId, canvasCount } = req.body;
    const user = req.user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!patternId) {
      throw HttpError(400, 'Pattern ID is required');
    }

    const patternExists = await patternServices.getPatternById(patternId);
    if (!patternExists) {
      throw HttpError(404, 'Pattern does not exist');
    }

    if (!user.cart) {
      user.cart = [];
    }

    if (user.cart.some((i) => i.patternId.toString() === patternId)) {
      throw HttpError(400, 'Pattern already in cart');
    }

    const canvasCountValue = canvasCount || 18;

    user.cart.push({ patternId, canvasCount: canvasCountValue });
    await user.save();

    res.status(200).json({
      message: 'Pattern added to cart',
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removePatternFromCart = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patternId } = req.body;
    const user = req.user;

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!patternId) {
      throw HttpError(400, 'Pattern ID is required');
    }

    if (!user.cart || !user.cart.length) {
      throw HttpError(400, 'Cart is empty');
    }

    const index = user.cart.findIndex((item) => item.toString() === patternId);
    if (index === -1) {
      throw HttpError(404, 'Pattern not found in cart');
    }

    user.cart.splice(index, 1);
    await user.save();

    res.status(200).json({
      message: 'Pattern removed from cart',
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};

export const checkoutCart = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      throw HttpError(401, 'User not authenticated');
    }

    if (!user.cart || !user.cart.length) {
      throw HttpError(400, 'Cart is empty');
    }

    const { comment, contactInfo } = req.body;

    const missingPatterns: string[] = [];
    const orderItems = [];
    for (const { patternId, canvasCount } of user.cart) {
      const pattern = await Pattern.findById(patternId);
      if (!pattern) {
        missingPatterns.push(patternId.toString());
      } else {
        orderItems.push({ patternId, canvasCount });
      }
    }

    if (missingPatterns.length > 0) {
      res.status(400).json({
        message: 'Some patterns are missing from the inventory',
        missingPatterns,
      });
      return;
    }

    const newOrderNumber = await orderNumber.generateOrderNumber();

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      comment: comment || null,
      orderNumber: newOrderNumber,
      contactInfo: {
        phone: contactInfo?.phone || null,
        instagram: contactInfo?.instagram || null,
        facebook: contactInfo?.facebook || null,
      },
    });

    const orderDetails = `
      Номер замовлення: ${order._id}
      Ім'я: ${order.user}
      
      Товари:
          ${order.items.map((item) => item._id).join('\n          ')}
      
      Загальна сума: ${order.items.length * 65}
    `;

    await telegramServices.sendOrderToTelegram(orderDetails);

    user.cart = [];
    await user.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};
