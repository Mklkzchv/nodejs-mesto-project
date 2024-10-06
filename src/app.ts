import express from 'express';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import helmet from 'helmet';
import path from 'path';

import { errorHandler } from './utils/errors/error-handler';
import types from './types';
import auth from './middlewares/auth';
import { createUser, loginUser } from './contollers/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import { userLoginValidate } from './middlewares/validate';

import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import NotFoundError from './utils/errors/not-found';


const cookieParser = require('cookie-parser');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const startServer = () => {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(requestLogger);

  // TODO frontend build
  app.use(express.static(path.join(__dirname, 'public', 'build')));
  app.use(express.static('public'));

  app.use(cookieParser());
  app.use(helmet());
  app.post('/signup', userLoginValidate, createUser);
  app.post('/signin', userLoginValidate, loginUser);

  app.use(auth);
  app.use('/users', usersRouter);
  app.use('/cards', cardsRouter);

  app.all('/*', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError({ message: 'Страница не найдена' }));
  });

  app.use(errorLogger);
  app.use(errorHandler);
  app.use(errors());

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};
mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('База данных подключена')
    startServer();
  })
  .catch((err) => console.log('Ошибка подключения к базе данных!', err));