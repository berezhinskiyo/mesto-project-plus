import { Router } from 'express';
import isURL from 'validator/lib/isURL';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const { celebrate, Joi } = require('celebrate');

const router = Router();
router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(7).custom((value: string) => {
      if (isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true })) return true;
      throw new Error('Wrong link url format');
    }),
  }),
}), createCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().length(24).hex(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

export default router;
