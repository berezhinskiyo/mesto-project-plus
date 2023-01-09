import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import Card from '../models/card';

const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const getCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  if (!ObjectId.isValid(cardId)) throw new ValidationError(' Передан некорректный идентификатор карточки');

  return Card.find({ _id: cardId })
    .then((cards) => {
      if (!cards || cards.length === 0) throw new NotFoundError('Карточка с указанным _id не найдена');
      return res.send({ data: cards });
    })
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  if (!ObjectId.isValid(cardId)) throw new ValidationError(' Передан некорректный идентификатор карточки');
  return Card.find({ _id: cardId, owner: req.user._id })
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с указанным _id не найдена');
      return res.send({ data: card });
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') throw new ValidationError('Переданы некорректные данные при создании карточки');
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  if (!ObjectId.isValid(cardId)) throw new ValidationError(' Передан некорректный идентификатор карточки');

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с указанным _id не найдена');
      return res.send({ data: card });
    })
    .catch(next);
};
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  if (!ObjectId.isValid(cardId)) throw new ValidationError(' Передан некорректный идентификатор карточки');
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с указанным _id не найдена');
      return res.send({ data: card });
    })
    .catch(next);
};
