import { v4 as uuidv4 } from 'uuid';
import { usersList } from '../model';
import { responseStatuses } from '../constants';

export default class UsersServiceController {
  static noUserFoundMessage(id) {
    return `no user found by id: {${id}}`;
  }

  static getUsers(req, res) {
    const users = usersList.getUsers();
    res.json(users);
  }

  static getUserById(req, res) {
    const { id } = req.params;
    const user = usersList.getUserById(id);

    if (user) {
      res.json(user);
    } else {
      res
        .status(responseStatuses.notFoundStatus)
        .send(UsersServiceController.noUserFoundMessage(id));
    }
  }

  static getAutoSuggestUsers(req, res) {
    const { query } = req;
    const { loginSubstring, limit } = query;

    const list = usersList.getAutoSuggestUsers(loginSubstring, limit);

    if (list) {
      res.json(list);
    } else {
      res.status(responseStatuses.clientErrorStatus).end();
    }
  }

  static createUser(req, res) {
    const { body: userInfo } = req;

    const userId = uuidv4();
    userInfo.id = userId;
    usersList.createUser(userInfo);

    res.json({ id: userId });
  }

  static updateUser(req, res) {
    const { body: userInfo } = req;

    try {
      usersList.updateUser(userInfo);
      res.status(responseStatuses.successStatusNoResp).end();
    } catch (error) {
      res
        .status(responseStatuses.notFoundStatus)
        .send(UsersServiceController.noUserFoundMessage(userInfo.id));
    }
  }

  static softDeleteUser(req, res) {
    const { body } = req;

    try {
      usersList.softDeleteUser(body.id);
      res.status(responseStatuses.successStatusNoResp).end();
    } catch (error) {
      res
        .status(responseStatuses.notFoundStatus)
        .send(UsersServiceController.noUserFoundMessage(body.id));
    }
  }
}
