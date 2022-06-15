import express from 'express';
import UsersServiceController from '../controllers';
import {
  userBodyJoiValidate,
  validateQuery,
  executeIfNoQuery
} from '../middlewares';

const {
  getUsers,
  getAutoSuggestUsers,
  getUserById,
  createUser,
  softDeleteUser,
  updateUser
} = UsersServiceController;

const router = express.Router();

router
  .get('/', executeIfNoQuery(getUsers), validateQuery, getAutoSuggestUsers)
  .get('/:id', getUserById)
  .post('/', userBodyJoiValidate, createUser)
  .put('/:id', userBodyJoiValidate, updateUser)
  .delete('/:id', softDeleteUser);

export { router };
