import { db } from '../models';
import { responseStatuses } from '../constants';

const { User } = db;
const { Op } = db.Sequelize;
const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

export default class UsersServiceController {
  static notFoundResponse(id, res) {
    res
      .status(responseStatuses.notFoundStatus)
      .send(`no user found by id: {${id}}`);
  }

  static async getUsers(req, res) {
    const users = await User.findAll({
      attributes
    });

    res.json(users);
  }

  static async getUserById(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, { attributes });

    if (user) {
      res.send(user);
    } else {
      UsersServiceController.notFoundResponse(id, res);
    }
  }

  static async getAutoSuggestUsers(req, res) {
    const { query } = req;
    const { loginSubstring = '', limit = 10, offset = 0 } = query;

    const users = await User.findAll({
      attributes,
      where: { login: { [Op.iLike]: `%${loginSubstring}` } },
      limit,
      offset
    });

    res.json(users);
  }

  static async createUser(req, res) {
    const { body: userBody } = req;

    const { id } = await User.create(userBody);

    res.json({ id });
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { body: userBody } = req;

    const [num] = await User.update(userBody, { where: { id } });

    if (num === 1) {
      res.send({
        message: 'User was updated successfully.'
      });
    } else {
      UsersServiceController.notFoundResponse(id, res);
    }
  }

  static async softDeleteUser(req, res) {
    const { id } = req.params;

    const num = await User.destroy({ where: { id } });

    if (num === 1) {
      res.send({
        message: 'User was deleted successfully!'
      });
    } else {
      UsersServiceController.notFoundResponse(id, res);
    }
  }
}
