import { Router } from 'express';

import {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} from '../contollers/users';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById); // getUser
usersRouter.post('/', createUser); // createUser
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

export default usersRouter;
