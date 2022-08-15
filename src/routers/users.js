import express from 'express';
import UsersController from '../controllers/user';
import { authenticate, joiValidate } from '../middlewares';
import { userSchema } from '../validation';

const {
  getUsers,
  getUserById,
  getAssociatedGroup,
  getAssociatedGroupsByUserId,
  createUser,
  updateUser,
  addGroupsToAUser,
  softDeleteUser,
  deleteGroupFromUser
} = UsersController;

const usersRouter = express.Router();

usersRouter
  .get('/', authenticate, getUsers)
  .get('/:id', authenticate, getUserById)
  .get('/:id/groups', authenticate, getAssociatedGroupsByUserId)
  .get('/:userId/groups/:groupId', authenticate, getAssociatedGroup)

  .post('/', authenticate, joiValidate(userSchema), createUser)

  .put('/:id', authenticate, joiValidate(userSchema), updateUser)
  .put('/:userId/groups', authenticate, addGroupsToAUser)
  .put('/:userId/groups/:groupId', authenticate, addGroupsToAUser)

  .delete('/:id', authenticate, softDeleteUser)
  .delete('/:userId/groups', authenticate, deleteGroupFromUser)
  .delete('/:userId/groups/:groupId', authenticate, deleteGroupFromUser);

export { usersRouter };
