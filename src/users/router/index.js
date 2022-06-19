import express from 'express';
import UsersServiceController from '../controller';
import { userBodyJoiValidate, executeIfNoQuery } from '../middlewares';

const { getAll, getAutoSuggestUsers, getById, create, update, softDelete } =
  UsersServiceController;

const router = express.Router();

router
  .get('/', executeIfNoQuery(getAll), getAutoSuggestUsers)
  .get('/:id', getById)
  .post('/', userBodyJoiValidate, create)
  .put('/:id', userBodyJoiValidate, update)
  .delete('/:id', softDelete);

export { router };
