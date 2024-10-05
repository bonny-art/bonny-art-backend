import { Response, Request, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';

export const getAllPatterns = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allPatterns = await patternServices.getAllPatterns();

    res.send({ allPatterns });
  } catch (error) {
    next(error);
  }
};

export const getPattern = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Получаем id паттерна из параметров URL
    const { patternId } = req.params;

    // Вызываем сервис, чтобы найти паттерн по ID
    const pattern = await patternServices.getPatternById(patternId);

    // Проверяем, найден ли паттерн
    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found' });
    }

    // Возвращаем найденный паттерн
    res.send(pattern);
  } catch (error) {
    next(error);
  }
};
