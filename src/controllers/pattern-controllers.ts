import { Response, NextFunction } from 'express';
import * as patternServices from '../services/pattern-services.js';
import * as dataHandlers from '../helpers/data-handlers.js';
import {
  checkPatternExistsRequest,
  setLanguageRequest,
} from '../types/patterns-type.js';

//todo: rfactor this to give patterns by pages
//todo: refactor this to use filters
export const getAllPatterns = async (
  req: setLanguageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang } = req;
    if (!lang) {
      res.status(404).send({ message: 'Language was not set' });
      return;
    }

    const patterns = await patternServices.getAllPatterns();

    const patternsData = dataHandlers.getAllPatternsDataByLanguage(
      patterns,
      lang
    );

    res.send({
      patterns: patternsData,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatternData = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang, pattern } = req;
    if (!lang) {
      res.status(404).send({ message: 'Language was not set' });
      return;
    }
    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found in request' });
      return;
    }

    const responsePattern = await dataHandlers.getPatternDataByLanguage(
      pattern,
      lang
    );

    res.send({
      pattern: responsePattern,
    });
  } catch (error) {
    next(error);
  }
};

//todo: refactor this to give photos by pages
//todo: refactor this to use language
export const getPhotosByPattern = async (
  req: checkPatternExistsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang, pattern } = req;
    if (!lang) {
      res.status(404).send({ message: 'Language was not set' });
      return;
    }
    if (!pattern) {
      res.status(404).send({ message: 'Pattern not found in request' });
      return;
    }

    const patternId = pattern._id.toString();

    const photos =
      await patternServices.getPhotosByPatternWithMasterAndWork(patternId);

    res.json({ photos });
  } catch (error) {
    next(error);
  }
};
