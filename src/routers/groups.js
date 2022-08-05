import express from 'express';
import GroupController from '../controllers/group';
import { authenticate, joiValidate } from '../middlewares';
import { groupSchema } from '../validation';

const {
  getGroups,
  getGroupById,
  getAssociatedUsersByGroupId,
  addUsersToGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  deleteUserFromAGroup
} = GroupController;

const groupsRouter = express.Router();

groupsRouter
  .get('/', authenticate, getGroups)
  .get('/:id', authenticate, getGroupById)
  .get('/:id/users', authenticate, getAssociatedUsersByGroupId)
  .post('/', authenticate, joiValidate(groupSchema), createGroup)
  .put('/:id', authenticate, joiValidate(groupSchema), updateGroup)
  .put('/:id/users', authenticate, addUsersToGroup)
  .put('/:groupId/users/:userId', authenticate, addUsersToGroup)
  .delete('/:id', authenticate, deleteGroup)
  .delete('/:groupId/users/:userId', authenticate, deleteUserFromAGroup);

export { groupsRouter };
