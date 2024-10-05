import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import BadRequestError from '../utils/errors/bad-request';
import NotFoundError from '../utils/errors/not-found';
import ForbiddenError from '../utils/errors/forbidden-error';
import { StatusCodes } from '../utils/errors/http-status-codes';

const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(StatusCodes.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Некорректные данные' }));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  return Card.findById(req.params.cardId)
    .orFail(new NotFoundError({ message: 'Карточки не существует' }))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError({ message: 'Ошибка прав доступа' }));
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((cardInfo) => res.send(cardInfo))
          .catch(next);
      }
    })
    .catch(next);
};

const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const owner = req.user._id;

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .orFail(new NotFoundError({ message: 'Карточки не существует' }))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Некорректные данные' }));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const owner = req.user._id;

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .orFail(new NotFoundError({ message: 'Карточки не существует' }))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Некорректные данные' }));
      } else {
        next(err);
      }
    })
    .catch(next);
};

export { getCards, createCard, deleteCard, likeCard, dislikeCard };
