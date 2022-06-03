import express from 'express';
import UsersServiceController from '../controllers';
import { userBodyJoiValidate, validateQuery } from '../middlewares';

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
  .get('/', getUsers)
  .get('/getAutoSuggestUsers', validateQuery, getAutoSuggestUsers)
  .get('/:id', getUserById)
  .post('/', userBodyJoiValidate, createUser)
  .put('/', userBodyJoiValidate, updateUser)
  .delete('/', softDeleteUser);

export { router };
