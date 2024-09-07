import { Router } from 'express';

import {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} from '../contollers/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);

export default cardsRouter;
