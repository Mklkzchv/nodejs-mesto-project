import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import NotFoundError from '../utils/errors/not-found';
import BadRequestError from '../utils/errors/bad-request';
import ConflictError from '../utils/errors/conflict';
import { StatusCodes } from '../utils/errors/http-status-codes';

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req: Request, res: Response, next: NextFunction) => {
  return User.findOne({ _id: req.params.userId })
    .orFail(() => new NotFoundError({ message: 'Пользователя не существует' }))
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash: string) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user: IUser) => {
          res.status(201).send({
            name: user.name,
            email: user.email,
            about: user.about,
            avatar: user.avatar,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError({ message: 'Пользователь уже существует' }));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError({ message: 'Некорректные данные' }));
          } else {
            next(err);
          }
        })
        .catch(next);
    })
    .catch(next);
};

const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError({ message: 'Пользователя не существует' }))
    .then((user) => res.status(StatusCodes.OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Некорректные данные' }));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError({ message: 'Пользователя не существует' }))
    .then((user) => res.status(StatusCodes.OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Некорректные данные' }));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY || 'key', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'ok' });
    })
    .catch(next);
};

const findUser = (req: Request, res: Response, next: NextFunction) => {
  console.log("!!", req.user._id);
  return User.findById(req.user._id)
    .orFail(() => new NotFoundError({ message: 'Пользователя не существует' }))
    .then((user) => res.status(StatusCodes.OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Некорректные данные' }));
      } else next(err);
    });
};

export {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  loginUser,
  findUser,
};
