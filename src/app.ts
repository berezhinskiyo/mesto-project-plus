import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import user from './routes/user';
import card from './routes/card';
import { ERROR_CODE_NOT_FOUND } from './const';

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
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: new ObjectId('63b9aefac55b8e26fbb74b26'),
  };

  next();
});

app.use('/users', user);
app.use('/cards', card);
app.use((req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ data: 'Страница не найдена' });
});

app.listen(+PORT);
