import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import NotFoundError from '../utils/errors/NotFoundError';
import BadRequestError from '../utils/errors/BadRequestError';
import ConflictError from '../utils/errors/ConflictError';
import { STATUS_CODES } from '../utils/constants';

//
// Функция получения юзеров
//
const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.status(STATUS_CODES.OK).send({ data: users }))
  .catch(next);

//
// Контроллер создания юзера
//
const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODES.CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует!'));
      }
      return next(err);
    });
};
//
// Контроллер получения информации о пользователе
//
const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
//
// Контроллер обновления информации юзера
//
const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  }
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};
//
// Контроллер обновления аватара юзера
//
const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
  }
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

export {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
