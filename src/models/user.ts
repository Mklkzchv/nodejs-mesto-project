import { model, Schema } from 'mongoose';

export type IUser = {
  name: string;
  about: string;
  avatar: string;
};

const userSchema = new Schema<IUser>({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // имя — обязательное поле
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  avatar: {
    type: String,
    required: true,
    default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  about: {
    type: String,
    required: true, // имя — обязательное поле
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
});

export default model<IUser>('user', userSchema);