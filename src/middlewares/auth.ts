import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import WrongPasswordError from '../errors/wrong-password-err';

export const { JWT_SECRET = 'dev-key' } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new WrongPasswordError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new WrongPasswordError('Необходима авторизация'));
  }

  req.user = { _id: new ObjectId((payload as JwtPayload)._id) };

  next();
};
