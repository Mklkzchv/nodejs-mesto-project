import { Types, Schema, model } from 'mongoose';
import validator from 'validator';

export type ICard = {
  __v: number;
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
};

const cardSchema = new Schema<ICard>(
  {
    __v: { type: Number, select: false },
    name: { // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      required: [true, 'Поле "Имя" должно быть заполнено'], // имя — обязательное поле
      minlength: [2, 'Минимальная длина поля "Имя" - 2'],
      maxlength: [30, 'Максимальная длина поля "Имя" - 30'],
    },
    link: {
      type: String,
      required: [true, 'Поле "Ссылка" должно быть заполнено'],
      validate: {
        validator: (url: string) => validator.isURL(url),
        message: 'Ссылка некорректная',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model<ICard>('card', cardSchema);
