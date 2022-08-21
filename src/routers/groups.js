import express from 'express';
import GroupController from '../controllers/group';
import { authenticate, joiValidate } from '../middlewares';
import { groupSchema } from '../validation';

const {
  getGroups,
  getGroupById,
  getAssociatedUser,
  getAssociatedUsersByGroupId,
  addUsersToGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  deleteUsersFromAGroup,
  deleteUserFromAGroup
} = GroupController;

const groupsRouter = express.Router();

groupsRouter
  .get('/', authenticate, getGroups)
  .get('/:id', authenticate, getGroupById)
  .get('/:id/users', authenticate, getAssociatedUsersByGroupId)
  .get('/:groupId/users/:userId', authenticate, getAssociatedUser)

  .post('/', authenticate, joiValidate(groupSchema), createGroup)

  .put('/:id', authenticate, joiValidate(groupSchema), updateGroup)
  .put('/:groupId/users', authenticate, addUsersToGroup)
  .put('/:groupId/users/:userId', authenticate, addUsersToGroup)

  .delete('/:id', authenticate, deleteGroup)
  .delete('/:groupId/users', authenticate, deleteUsersFromAGroup)
  .delete('/:groupId/users/:userId', authenticate, deleteUserFromAGroup);

export { groupsRouter };
