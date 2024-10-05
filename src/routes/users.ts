import { Router } from 'express';
import {
  findUser, getUserById, getUsers, updateProfile, updateAvatar,
} from '../contollers/users';
import {
  userIdValidate, userUpdateAvatarValidate, userUpdateValidate,
} from '../ middlewares/validate';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', userIdValidate, getUserById);
usersRouter.get('/me', findUser); // возвращаем информацию о текущем пользователе
usersRouter.patch('/me', userUpdateValidate, updateProfile);
usersRouter.patch('/me/avatar', userUpdateAvatarValidate, updateAvatar);

export default usersRouter;
