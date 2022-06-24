import express from 'express';
import UsersServiceController from '../controller';
import { userBodyJoiValidate, executeIfNoQuery } from '../middlewares';

const {
  getUsers,
  getAutoSuggestUsers,
  getUserById,
  createUser,
  updateUser,
  softDeleteUser
} = UsersServiceController;

const router = express.Router();

router
  .get('/', executeIfNoQuery(getUsers), getAutoSuggestUsers)
  .get('/:id', getUserById)
  .post('/', userBodyJoiValidate, createUser)
  .put('/:id', userBodyJoiValidate, updateUser)
  .delete('/:id', softDeleteUser);

export { router };
