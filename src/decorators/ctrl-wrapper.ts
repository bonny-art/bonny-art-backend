import { Request, Response, NextFunction } from 'express';

const ctrlWrapper = <T>(
  ctrl: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

export default ctrlWrapper;
