import express from 'express';
import GroupController from '../controllers/group';
import { authenticate, joiValidate } from '../middlewares';
import { groupSchema } from '../validation';

const { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } =
  GroupController;

const groupsRouter = express.Router();

groupsRouter
  .get('/', authenticate, getGroups)
  .get('/:id', authenticate, getGroupById)
  .post('/', authenticate, joiValidate(groupSchema), createGroup)
  .put('/:id', authenticate, joiValidate(groupSchema), updateGroup)
  .delete('/:id', authenticate, deleteGroup);

export { groupsRouter };
