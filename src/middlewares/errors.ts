import { Request, Response } from 'express';
import BaseException from '../errors/base-err';
import { ERROR_CODE_OTHER, ERROR_CODE_NOT_FOUND } from '../const';

export const commonErrorHandler = (err: BaseException, req: Request, res: Response) => {
  const { status = ERROR_CODE_OTHER, message } = err;
  res
    .status(status)
    .send({
      message: status === ERROR_CODE_OTHER
        ? 'На сервере произошла ошибка'
        : message,
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).json({
    message: 'Страница не найдена',
  });
};
