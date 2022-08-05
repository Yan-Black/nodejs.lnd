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
  addGroupToAUser,
  softDeleteUser,
  deleteGroupFromUser
} = UsersController;

const usersRouter = express.Router();

usersRouter
  .get('/', authenticate, getUsers)
  .get('/:id', authenticate, getUserById)
  .get('/:id/groups', authenticate, getAssociatedGroupsByUserId)
  .post('/', authenticate, joiValidate(userSchema), createUser)
  .put('/:id', authenticate, joiValidate(userSchema), updateUser)
  .put('/:userId/groups/:groupId', authenticate, addGroupToAUser)
  .delete('/:id', authenticate, softDeleteUser)
  .delete('/:userId/groups/:groupId', authenticate, deleteGroupFromUser);

export { usersRouter };
