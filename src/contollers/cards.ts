import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import NotFoundError from '../utils/errors/NotFoundError';
import BadRequestError from '../utils/errors/BadRequestError';
import { STATUS_CODES } from '../utils/constants';

//
// Функция получения карточек
//
export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.status(STATUS_CODES.OK).send({ data: cards }))
  .catch(() => res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка' }));
//
// Функция удаления карточки
//
export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.cardId)

    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};
//
// Функция создания карточек
//
export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  if (!name || !link || !owner) {
    return res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
  }

  return Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CODES.CREATED).send({ data: card }))
    .catch(() => res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};
//
// Контроллер постановки лайка
//
export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(STATUS_CODES.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};
//
// Контроллер удаления лайка
//
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(STATUS_CODES.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      }
      return next(err);
    });
};
