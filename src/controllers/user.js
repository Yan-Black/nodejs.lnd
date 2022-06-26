import UsersService from '../service/user';
import { notFoundResponse } from '../helpers';

export default class UsersController {
  static async getUsers(req, res) {
    const { query } = req;
    const { loginSubstring, limit, offset } = query;

    const users = await UsersService.getAll(loginSubstring, limit, offset);

    res.json(users);
  }

  static async getUserById(req, res) {
    const { id } = req.params;

    const user = await UsersService.getById(id);

    user ? res.send(user) : notFoundResponse(id, res);
  }

  static async createUser(req, res) {
    const { body: userDTO } = req;

    const { id } = await UsersService.create(userDTO);

    res.json({ id });
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { body: userDTO } = req;

    const isSuccess = await UsersService.update(id, userDTO);

    isSuccess
      ? res.send({
          message: 'User was updated successfully.'
        })
      : notFoundResponse(id, res);
  }

  static async softDeleteUser(req, res) {
    const { id } = req.params;

    const isSuccess = await UsersService.delete(id);

    isSuccess
      ? res.send({
          message: 'User was deleted successfully!'
        })
      : notFoundResponse(id, res);
  }
}
