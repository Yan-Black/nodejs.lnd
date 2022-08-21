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
    const { id } = req.params;
    const user = await UsersService.getById(id);

    if (!user) {
      throw new HTTP404Error(`no user found by id: ${id}`);
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async getAssociatedGroup(req, res) {
    const { userId, groupId } = req.params;
    const group = await UsersService.getAssociatedGroup(userId, groupId);

    if (!group) {
      throw new HTTP404Error(
        `group with id: ${userId} or user with id: ${groupId} not found`
      );
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async getAssociatedGroupsByUserId(req, res) {
    const { id } = req.params;
    const groups = await UsersService.getAssociatedGroups(id);

    if (!groups) {
      throw new HTTP404Error(
        `no associated groups found for user with id: ${id} or this user doesn't exist`
      );
    }

    const response = responseBuilder.createResponse(groups);
    res.json(response);
  }

  static async addGroupsToAUser(req, res) {
    const { userId, groupId } = req.params;
    const { groupIds } = req.body;

    const groups = await UsersService.addGroups(userId, groupIds || groupId);

    const response = responseBuilder.createResponse(groups);
    res.json(response);
  }

  static async createUser(req, res) {
    const { body: userDTO } = req;
    const user = await UsersService.create(userDTO);

    if (!user) {
      throw new HTTP400Error('entity already exists');
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { body: userDTO } = req;
    const user = await UsersService.update(id, userDTO);

    if (!user) {
      throw new HTTP404Error(`no user found by id: ${id}`);
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async softDeleteUser(req, res) {
    const { id } = req.params;
    const result = await UsersService.delete(id);

    if (result === null) {
      throw new HTTP404Error();
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }

  static async deleteGroupFromUser(req, res) {
    const { userId, groupId } = req.params;
    const result = await UsersService.removeGroup(userId, groupId);

    if (result === null) {
      throw new HTTP404Error();
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }

  static async deleteGroupsFromUser(req, res) {
    const { userId } = req.params;
    const result = await UsersService.removeGroups(userId);

    if (result === null) {
      throw new HTTP404Error();
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }
}
