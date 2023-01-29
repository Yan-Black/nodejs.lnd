import express from 'express';
import GroupController from '../controllers/group.associations';
import { authenticate, joiValidate } from '../middlewares';
import {
  groupPostSchema,
  groupPutSchema,
  userIdListSchema
} from '../validation';

const {
  getGroups,
  getGroupById,
  getAssociatedUser,
  getAssociatedUsersByGroupId,
  addUserToGroup,
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
  .get('/:groupId', authenticate, getGroupById)
  .post('/', authenticate, joiValidate(groupPostSchema), createGroup)
  .put('/:groupId', authenticate, joiValidate(groupPutSchema), updateGroup)
  .delete('/:groupId', authenticate, deleteGroup);
// associations
groupsRouter
  .get('/:groupId/users', authenticate, getAssociatedUsersByGroupId)
  .get('/:groupId/users/:userId', authenticate, getAssociatedUser)

  .put(
    '/:groupId/users',
    authenticate,
    joiValidate(userIdListSchema),
    addUsersToGroup
  )
  .put('/:groupId/users/:userId', authenticate, addUserToGroup)

  .delete('/:groupId/users', authenticate, deleteUsersFromAGroup)
  .delete('/:groupId/users/:userId', authenticate, deleteUserFromAGroup);

export { groupsRouter };
