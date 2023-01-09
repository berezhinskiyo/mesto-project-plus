import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import user from './routes/user';
import card from './routes/card';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import BaseException from './errors/base-err';
import { ERROR_CODE_NOT_FOUND, ERROR_CODE_OTHER } from './const';
import { requestLogger, errorLogger } from './middlewares/logger'; 

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

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

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
app.use((err: BaseException, req: Request, res: Response) => {
  const { status = ERROR_CODE_OTHER, message } = err;
  res
    .status(status)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: status === ERROR_CODE_OTHER
        ? 'На сервере произошла ошибка'
        : message,
    });
});
app.use((req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).json({
    message: 'Страница не найдена',
  });
});

app.listen(+PORT);
