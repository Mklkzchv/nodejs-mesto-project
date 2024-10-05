import { ErrorRequestHandler } from 'express';
import { StatusCodes } from './http-status-codes';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
    return;
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
  next();
};

export { errorHandler };
