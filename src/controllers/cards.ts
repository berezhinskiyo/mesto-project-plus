import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Card from '../models/card';
import { ERROR_CODE_NOT_FOUND, ERROR_CODE_VALIDATION, ERROR_CODE_OTHER } from '../const'

export const getCards = (req: Request, res: Response) => Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const getCard = (req: Request, res: Response) => {
    const { cardId } = req.params;

    if (!ObjectId.isValid(cardId))
        return res.status(ERROR_CODE_VALIDATION).send({ message: ' Передан некорректный идентификатор карточки' });

    return Card.find({ _id: cardId })
        .then((cards) => {
            if (!cards || cards.length === 0) return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
            return res.send({ data: cards });
        })
        .catch((error) => {
            return res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
        });
};

export const deleteCard = (req: Request, res: Response) => {
    const { cardId } = req.params;

    if (!ObjectId.isValid(cardId))
        return res.status(ERROR_CODE_VALIDATION).send({ message: ' Передан некорректный идентификатор карточки' });

    return Card.findByIdAndRemove(cardId)
        .then((card) => {
            if (!card) return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
            return res.send({ data: card });
        })
        .catch(() => res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' }));
};

export const createCard = (req: Request, res: Response) => {
    const { name, link } = req.body;

    return Card.create({ name, link, owner: req.user._id })
        .then((card) => res.send({ data: card }))
        .catch((error) => {
            if (error.name === 'ValidationError') return res.status(ERROR_CODE_VALIDATION).send({ message: ' Переданы некорректные данные при создании карточки' });
            return res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
        });
};

export const likeCard = (req: Request, res: Response) => {
    const { cardId } = req.params;

    if (!ObjectId.isValid(cardId))
        return res.status(ERROR_CODE_VALIDATION).send({ message: ' Передан некорректный идентификатор карточки' });

    Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
    )
        .then((card) => {
            if (!card) return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
            return res.send({ data: card });
        })
        .catch((error) => {
            if (error.name === 'CastError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные для постановки лайка.' });
            return res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
        });
};
export const dislikeCard = (req: Request, res: Response) => {
    const { cardId } = req.params;

    if (!ObjectId.isValid(cardId))
        return res.status(ERROR_CODE_VALIDATION).send({ message: ' Передан некорректный идентификатор карточки' });

    Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
    )
        .then((card) => {
            if (!card) return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
            return res.send({ data: card });
        })
        .catch((error) => {
            if (error.name === 'CastError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные для снятии лайка.' });
            return res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
        });
};
