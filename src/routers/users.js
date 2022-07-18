import express from 'express';
import UsersController from '../controllers/user';
import { authenticate, joiValidate } from '../middlewares';
import { userSchema } from '../validation';

const { getUsers, getUserById, createUser, updateUser, softDeleteUser } =
  UsersController;

const usersRouter = express.Router();

usersRouter
  .get('/', authenticate, getUsers)
  .get('/:id', authenticate, getUserById)
  .post('/', authenticate, joiValidate(userSchema), createUser)
  .put('/:id', authenticate, joiValidate(userSchema), updateUser)
  .delete('/:id', authenticate, softDeleteUser);

export { usersRouter };
