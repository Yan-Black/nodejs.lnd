import UsersService from '../service/user';
import HTTP404Error from '../errorHandler/HTTP404Error';
import HTTP410Error from '../errorHandler/HTTP410Error';
import HTTP400Error from '../errorHandler/HTTP400Error';
import { responseBuilder } from '../helpers/ResponseBuilder';
import { httpStatusCode } from '../constants';

export default class UsersController {
  static async getUsers(req, res) {
    const { query } = req;
    const { loginSubstring, limit, offset } = query;

    const users = await UsersService.getAll(loginSubstring, limit, offset);

    const response = responseBuilder.createResponse(users);
    res.json(response);
  }

  static async getUserById(req, res) {
    const { userId } = req.params;
    const user = await UsersService.getById(userId);

    if (!user) {
      throw new HTTP404Error('user not found', { userId });
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async createUser(req, res) {
    const { body: userDTO } = req;
    const user = await UsersService.create(userDTO);

    if (!user) {
      throw new HTTP400Error('user already exists');
    }

    const response = responseBuilder.createResponse(user);
    res.status(httpStatusCode.OK_NEW_RESOURCE_CREATED).json(response);
  }

  static async updateUser(req, res) {
    const { userId } = req.params;
    const { body: userDTO } = req;
    const user = await UsersService.update(userId, userDTO);

    if (!user) {
      throw new HTTP404Error('user not found', { userId });
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async softDeleteUser(req, res) {
    const { userId } = req.params;
    const result = await UsersService.delete(userId);

    if (result === null) {
      throw new HTTP404Error('user not found', { userId });
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }
}
