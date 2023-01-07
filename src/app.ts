import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import user from './routes/user';
import card from './routes/card';
import { ObjectId } from 'mongodb';
mongoose.set('strictQuery', false);
declare global {
  namespace Express {
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
app.use((req: Request, res: Response, next) => {
  req.user = {
    _id: new ObjectId('63b9aefac55b8e26fbb74b26'),
  };

  next();
});

app.use('/users', user);
app.use('/cards', card);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});