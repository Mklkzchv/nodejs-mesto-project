import mongoose, { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../utils/errors/unauthorized-error';

export type IUser = {
  __v: number;
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
};

export type UserModel = mongoose.Model<IUser> & {
  findUserByCredentials: (
    email: string,
    password: string,
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
};

const userSchema = new Schema<IUser, UserModel>(
  {
    __v: { type: Number, select: false },
    name: { // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      minlength: [2, 'Минимальная длина поля "Имя" - 2'],
      maxlength: [30, 'Максимальная длина поля "Имя" - 30'],
      default: 'Жак-Ив Кусто',
    },
    avatar: {
      type: String,
      validate: {
        validator: (url: string) => validator.isURL(url),
        message: 'Некорректный URL',
      },
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "Описание" - 2'],
      maxlength: [200, 'Максимальная длина поля "Описание" - 200'],
      default: 'Исследователь',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: 'Некорректный Email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // по умолчанию хеш пароля пользователя не будет возвращаться из базы
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password') // здесь в объекте user будет хеш пароля
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError({
            message: 'Неправильные почта или пароль',
          }),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError({
              message: 'Неправильные почта или пароль',
            }),
          );
        }
        return user;
      });
    });
};

export default model<IUser, UserModel>('user', userSchema);
