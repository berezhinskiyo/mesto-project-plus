import { Router } from 'express';
import isURL from 'validator/lib/isURL';
import {
  getUsers, getMe, getUser, patchMe, patchMeAvatar,
} from '../controllers/users';

const { celebrate, Joi } = require('celebrate');

const router = Router();
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
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
    avatar: Joi.string().required().custom((value: string) => {
      if (isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true })) return value;
      throw new Error('Wrong link url format');
    }),
  }),
}), patchMeAvatar);
export default router;
