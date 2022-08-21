import GroupService from '../service/group';
import HTTP404Error from '../errorHandler/HTTP404Error';
import HTTP410Error from '../errorHandler/HTTP410Error';
import HTTP400Error from '../errorHandler/HTTP400Error';
import { responseBuilder } from '../helpers/ResponseBuilder';
import { httpStatusCode } from '../constants';

export default class GroupController {
  static async getGroups(req, res) {
    const groups = await GroupService.getAll();
    const response = responseBuilder.createResponse(groups);

    res.json(response);
  }

  static async getGroupById(req, res) {
    const { id } = req.params;
    const group = await GroupService.getById(id);

    if (!group) {
      throw new HTTP404Error(`no group found by id: ${id}`);
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async getAssociatedUser(req, res) {
    const { groupId, userId } = req.params;
    const user = await GroupService.getAssociatedUser(groupId, userId);

    if (!user) {
      throw new HTTP404Error(
        `users with id: ${userId} or group with id: ${groupId} not found`
      );
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async getAssociatedUsersByGroupId(req, res) {
    const { id } = req.params;
    const users = await GroupService.getAssociatedUsers(id);

    if (!users) {
      throw new HTTP404Error(
        `no users found for group with id: ${id} or this group doesn't exist`
      );
    }

    const response = responseBuilder.createResponse(users);
    res.json(response);
  }

  static async addUsersToGroup(req, res) {
    const { groupId, userId } = req.params;
    const { userIds } = req.body;

    const users = await GroupService.addUsers(groupId, userIds || userId);

    const response = responseBuilder.createResponse(users);
    res.json(response);
  }

  static async createGroup(req, res) {
    const { body: groupDTO } = req;
    const group = await GroupService.create(groupDTO);

    if (!group) {
      throw new HTTP400Error('entity already exists');
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async updateGroup(req, res) {
    const { id } = req.params;
    const { body: groupDTO } = req;

    const group = await GroupService.update(id, groupDTO);

    if (!group) {
      throw new HTTP404Error(`no group found by id: ${id}`);
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async deleteGroup(req, res) {
    const { id } = req.params;
    const result = await GroupService.delete(id);

    if (result === null) {
      throw new HTTP404Error();
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }

  static async deleteUserFromAGroup(req, res) {
    const { groupId, userId } = req.params;
    const result = await GroupService.removeUser(groupId, userId);

    if (result === null) {
      throw new HTTP404Error();
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }

  static async deleteUsersFromAGroup(req, res) {
    const { groupId } = req.params;
    const result = await GroupService.removeUsers(groupId);

    if (result === null) {
      throw new HTTP404Error();
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }
}
