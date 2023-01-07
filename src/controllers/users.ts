import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import User from '../models/user';
import { ERROR_CODE_NOT_FOUND, ERROR_CODE_VALIDATION, ERROR_CODE_OTHER } from '../const'

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Произошла ошибка' }));

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  return User.find({ _id: new ObjectId(userId) })
    .then((users) => {
      if (users.length === 0) return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      res.send({ data: users });
    })
    .catch(() => res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Произошла ошибка' });
    });
};
export const patchMe = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about, avatar })
    .then((users) => {
      if (!users) return res.status(ERROR_CODE_OTHER).send({ message: 'Пользователь по указанному _id не найден' });
      return res.send();
    })
    .catch((error) => {
      if (error.name === 'ValidationError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Произошла ошибка' });
    });
};
export const patchMeAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar })
    .then((users) => {
      if (!users) return res.status(ERROR_CODE_OTHER).send({ message: 'Пользователь по указанному _id не найден' });
      return res.send();
    })
    .catch((error) => {
      if (error.name === 'ValidationError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Произошла ошибка' });
    });
};
