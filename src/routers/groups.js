import express from 'express';
import GroupController from '../controllers/group';
import { joiValidate } from '../middlewares';
import { groupSchema } from '../validation';

const { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } =
  GroupController;

const groupsRouter = express.Router();

groupsRouter
  .get('/', getGroups)
  .get('/:id', getGroupById)
  .post('/', joiValidate(groupSchema), createGroup)
  .put('/:id', joiValidate(groupSchema), updateGroup)
  .delete('/:id', deleteGroup);

export { groupsRouter };
