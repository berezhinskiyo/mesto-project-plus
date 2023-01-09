import { Request, Response, NextFunction } from 'express';

import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const WrongPasswordError = require('../errors/wrong-password-err');

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) throw new ValidationError('Передан некорректный идентификатор пользователя');

  return User.findOne({ _id: userId })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по указанному _id не найден');
      return res.send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((error) => {
        if (error.name === 'ValidationError') throw new ValidationError('Переданы некорректные данные при создании пользователя');
      })
      .catch(next));
};

export const getMe = (req: Request, res: Response, next: NextFunction) => User.findOne(req.user._id)
  .then((user) => {
    if (!user) throw new NotFoundError('Пользователь по указанному _id не найден');
    return res.send({ data: user });
  })
  .catch(next);

export const patchMe = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по указанному _id не найден');
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') throw new ValidationError('Переданы некорректные данные при обновлении профиля');
    }).catch(next);
};
export const patchMeAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по указанному _id не найден');
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') throw new ValidationError('Переданы некорректные данные при обновлении аватара');
    }).catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((error: Error) => {
      next(new WrongPasswordError(error.message));
    });
};
