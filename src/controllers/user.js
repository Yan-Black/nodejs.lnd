import UsersService from '../service/user';
import HTTP404Error from '../errorHandler/HTTP404Error';

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

    if (!user) {
      throw new HTTP404Error(`no user found by id: ${id}`);
    }

    res.send(user);
  }

  static async getAssociatedGroupsByUserId(req, res) {
    const { id } = req.params;

    const groups = await UsersService.getAssociatedGroups(id);

    if (!groups) {
      throw new HTTP404Error(`no groups found by user id: ${id}`);
    }

    res.send(groups);
  }

  static async getUserGroupsByUserId(req, res) {
    const { id } = req.params;

    const user = await UsersService.getById(id);

    if (!user) {
      throw new HTTP404Error(`no user found by id: ${id}`);
    }

    res.send(user);
  }

  static async createUser(req, res) {
    const { body: userDTO } = req;

    const id = await UsersService.create(userDTO);

    res.json({ id });
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { body: userDTO } = req;

    const isSuccess = await UsersService.update(id, userDTO);

    if (!isSuccess) {
      throw new HTTP404Error(`no user found by id: ${id}`);
    }

    res.send({
      message: 'User was updated successfully.'
    });
  }

  static async softDeleteUser(req, res) {
    const { id } = req.params;

    const isSuccess = await UsersService.delete(id);

    if (!isSuccess) {
      throw new HTTP404Error(`no user found by id: ${id}`);
    }

    res.send({
      message: 'User was deleted successfully.'
    });
  }
}
