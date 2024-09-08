import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import helmet from 'helmet';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import NotFoundError from './utils/errors/NotFoundError';
import errorHandler from './middlewares/errorHandler';
import types from './types';

mongoose.set('strictQuery', true);

// Слушаем 3000 порт
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(MONGO_URL)
  .then(() => console.log('База данных подключена'))
  .catch((err) => console.log('Ошибка подключения к базе данных!', err));

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66d4aeb53b7482588103e5f0',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

//
// При переходе по несуществюущему пути
//
app.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorHandler);
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
