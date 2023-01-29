import express from 'express';
import UsersController from '../controllers/user.associations';
import { authenticate, joiValidate } from '../middlewares';
import {
  userPostSchema,
  userPutSchema,
  groupIdListSchema
} from '../validation';

const {
  getUsers,
  getUserById,
  getAssociatedGroup,
  getAssociatedGroupsByUserId,
  createUser,
  updateUser,
  addGroupToAUser,
  addGroupsToAUser,
  softDeleteUser,
  deleteGroupsFromUser,
  deleteGroupFromUser
} = UsersController;

const usersRouter = express.Router();

usersRouter
  .get('/', authenticate, getUsers)
  .get('/:userId', authenticate, getUserById)
  .post('/', authenticate, joiValidate(userPostSchema), createUser)
  .put('/:userId', authenticate, joiValidate(userPutSchema), updateUser)
  .delete('/:userId', authenticate, softDeleteUser);
// associations
usersRouter
  .get('/:userId/groups', authenticate, getAssociatedGroupsByUserId)
  .get('/:userId/groups/:groupId', authenticate, getAssociatedGroup)

  .put(
    '/:userId/groups',
    authenticate,
    joiValidate(groupIdListSchema),
    addGroupsToAUser
  )
  .put('/:userId/groups/:groupId', authenticate, addGroupToAUser)

  .delete('/:userId/groups', authenticate, deleteGroupsFromUser)
  .delete('/:userId/groups/:groupId', authenticate, deleteGroupFromUser);

export { usersRouter };
