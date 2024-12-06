import { Response, NextFunction } from 'express';

import * as likesServices from '../services/like-services.js';
import * as patternServices from '../services/pattern-services.js';

import * as dataHandlers from '../helpers/data-handlers.js';
import HttpError from '../helpers/http-error.js';

import { checkPatternExistsRequest } from '../types/common-types.js';

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
    const { patternId } = req.body;
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

    if (user.cart.some((i) => i.toString() === patternId)) {
      throw HttpError(400, 'Pattern already in cart');
    }

    user.cart.push(patternId);
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

    const missingPatterns: string[] = [];
    for (const patternId of user.cart) {
      const pattern = await patternServices.getPatternById(
        patternId.toString()
      );
      if (!pattern) {
        missingPatterns.push(patternId.toString());
      }
    }

    if (missingPatterns.length > 0) {
      res.status(400).json({
        message: 'Some patterns are missing from the inventory',
        missingPatterns,
      });
      return;
    }

    user.cart = [];
    await user.save();

    res.status(200).json({
      message: 'Order placed successfully',
    });
  } catch (error) {
    next(error);
  }
};
