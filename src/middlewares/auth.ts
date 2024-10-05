import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../utils/errors/unauthorized-error';

const jwt = require('jsonwebtoken');

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    return next(new UnauthorizedError({ message: 'Необходима авторизация!' }));
  }
  req.user = payload; // добавляем пейлоуд токена в объект запроса и вызываем next

  next(); // пропускаем запрос дальше
};

export default auth;
