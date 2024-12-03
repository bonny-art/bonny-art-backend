import { Response, NextFunction } from 'express';

import * as likesServices from '../services/like-services.js';

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

export const addToCart = async (
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
