import { db } from '../model';
import { responseStatuses } from '../constants';

const User = db.user;

export default class UsersServiceController {
  static noUserFoundMessage(id) {
    return `no user found by id: {${id}}`;
  }

  static getUsers(req, res) {
    User.findAll().then((users) => {
      res.json(users);
    });
  }

  static getUserById(req, res) {
    const { id } = req.params;

    User.findByPk(id).then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(responseStatuses.notFoundStatus)
          .send(UsersServiceController.noUserFoundMessage(id));
      }
    });
  }

  static getAutoSuggestUsers(req, res) {
    const { query } = req;
    const { loginSubstring, limit } = query;
    const condition = {
      login: db.sequelize.where(
        db.sequelize.fn('LOWER', db.sequelize.col('login')),
        'LIKE',
        `%${loginSubstring.toLowerCase()}%`
      )
    };

    User.findAll({ where: condition }).then((users) => {
      if (users) {
        res.json(users.slice(0, limit));
      } else {
        res.status(responseStatuses.clientErrorStatus).end();
      }
    });
  }

  static createUser(req, res) {
    const { body: userBody } = req;

    User.create(userBody).then((userData) => {
      res.json({ id: userData.id });
    });
  }

  static updateUser(req, res) {
    const { id } = req.params;
    const { body: userBody } = req;

    User.update(userBody, { where: { id } }).then(([num]) => {
      if (num === 1) {
        res.send({
          message: 'User was updated successfully.'
        });
      } else {
        res.send(UsersServiceController.noUserFoundMessage(id));
      }
    });
  }

  static softDeleteUser(req, res) {
    const { id } = req.params;

    User.destroy({ where: { id } }).then((num) => {
      if (num === 1) {
        res.send({
          message: 'User was deleted successfully!'
        });
      } else {
        res.send(UsersServiceController.noUserFoundMessage(id));
      }
    });
  }
}
