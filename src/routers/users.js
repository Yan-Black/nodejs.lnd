import express from 'express';
import UsersController from '../controllers/user';
import { authenticate, joiValidate } from '../middlewares';
import { userSchema } from '../validation';

const {
  getUsers,
  getUserById,
  getAssociatedGroupsByUserId,
  createUser,
  updateUser,
  softDeleteUser
} = UsersController;

const usersRouter = express.Router();

usersRouter
  .get('/', getUsers)
  .get('/:id', getUserById)
  .get('/:id/groups', getAssociatedGroupsByUserId)
  .post('/', joiValidate(userSchema), createUser)
  .put('/:id', joiValidate(userSchema), updateUser)
  .delete('/:id', softDeleteUser);

export { usersRouter };
