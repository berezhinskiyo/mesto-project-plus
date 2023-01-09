import { Router } from 'express';
import {
  getUsers, getMe, getUser, patchMe, patchMeAvatar,
} from '../controllers/users';

const { celebrate, Joi } = require('celebrate');

const router = Router();
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), patchMe);
router.get('/me', getMe);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), patchMeAvatar);
export default router;
