import './env';
import express from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import user from './routes/user';
import card from './routes/card';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

import { requestLogger, errorLogger } from './middlewares/logger';
import { commonErrorHandler, notFoundHandler } from './middlewares/errors';

const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

mongoose.set('strictQuery', false);
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-shadow, no-unused-vars
    interface Request {
      user: {
        _id: ObjectId;
      }
    }
  }
}

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

// подключаем rate-limiter
app.use(limiter);

mongoose.connect(MONGO_URL);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);
app.post('/signup', createUser);
app.post('/signin', login);

// авторизация
app.use(auth);

app.use('/users', user);
app.use('/cards', card);

app.use(errorLogger);
app.use(errors());

app.use(notFoundHandler);
app.use(commonErrorHandler);

app.listen(+PORT);
