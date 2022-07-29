import express from 'express';
import GroupController from '../controllers/group';
import { authenticate, joiValidate } from '../middlewares';
import { groupSchema } from '../validation';

const {
  getGroups,
  getGroupById,
  getAssociatedUsersByUserId,
  addUsersToGroup,
  createGroup,
  updateGroup,
  deleteGroup
} = GroupController;

const groupsRouter = express.Router();

groupsRouter
  .get('/', getGroups)
  .get('/:id', getGroupById)
  .get('/:id/users', getAssociatedUsersByUserId)
  .post('/', joiValidate(groupSchema), createGroup)
  .put('/:id', joiValidate(groupSchema), updateGroup)
  .put('/:id/users', addUsersToGroup)
  .delete('/:id', deleteGroup);

export { groupsRouter };
