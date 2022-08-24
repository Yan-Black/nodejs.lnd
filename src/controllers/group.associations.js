import GroupService from '../service/group.associations';
import GroupsController from './group';
import HTTP404Error from '../errorHandler/HTTP404Error';
import HTTP410Error from '../errorHandler/HTTP410Error';
import { responseBuilder } from '../helpers/ResponseBuilder';
import { httpStatusCode } from '../constants';

export default class GroupControllerAssociations extends GroupsController {
  static async getAssociatedUser(req, res) {
    const { groupId, userId } = req.params;
    const user = await GroupService.getAssociatedUser(groupId, userId);

    if (!user) {
      throw new HTTP404Error(
        "Specified group or user or relation between them doesn't exist",
        { groupId, userId }
      );
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async getAssociatedUsersByGroupId(req, res) {
    const { groupId } = req.params;
    const users = await GroupService.getAssociatedUsers(groupId);

    if (!users) {
      throw new HTTP404Error('group not found', { groupId });
    }

    const response = responseBuilder.createResponse(users);
    res.json(response);
  }

  static async addUserToGroup(req, res) {
    const { groupId, userId } = req.params;
    const group = await GroupService.addUser(groupId, userId);

    if (!group) {
      throw new HTTP404Error("Specified group or user doesn't exist", {
        groupId,
        userId
      });
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async addUsersToGroup(req, res) {
    const { groupId } = req.params;
    const { userIds } = req.body;
    const group = await GroupService.addUsers(groupId, userIds);

    if (!group) {
      throw new HTTP404Error("Specified group or user doesn't exist", {
        groupId,
        userIds
      });
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async deleteUserFromAGroup(req, res) {
    const { groupId, userId } = req.params;
    const result = await GroupService.removeUser(groupId, userId);

    if (result === null) {
      throw new HTTP404Error(
        "Specified group or user or relation between them doesn't exist",
        { groupId, userId }
      );
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
      throw new HTTP404Error('group not found', { groupId });
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }
}
