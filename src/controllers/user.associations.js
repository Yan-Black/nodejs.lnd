import UsersService from '../service/user.associations';
import UsersController from './user';
import HTTP404Error from '../errorHandler/HTTP404Error';
import HTTP410Error from '../errorHandler/HTTP410Error';
import { responseBuilder } from '../helpers/ResponseBuilder';
import { httpStatusCode } from '../constants';

export default class UsersControllerAssociations extends UsersController {
  static async getAssociatedGroup(req, res) {
    const { userId, groupId } = req.params;
    const group = await UsersService.getAssociatedGroup(userId, groupId);

    if (!group) {
      throw new HTTP404Error(
        "Specified user or group or relation between them doesn't exist",
        { userId, groupId }
      );
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async getAssociatedGroupsByUserId(req, res) {
    const { userId } = req.params;
    const groups = await UsersService.getAssociatedGroups(userId);

    if (!groups) {
      throw new HTTP404Error('user not found', { userId });
    }

    const response = responseBuilder.createResponse(groups);
    res.json(response);
  }

  static async addGroupToAUser(req, res) {
    const { userId, groupId } = req.params;
    const user = await UsersService.addGroup(userId, groupId);

    if (!user) {
      throw new HTTP404Error("Specified user or group doesn't exist", {
        userId,
        groupId
      });
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async addGroupsToAUser(req, res) {
    const { userId } = req.params;
    const { groupIds } = req.body;

    const user = await UsersService.addGroups(userId, groupIds);

    if (!user) {
      throw new HTTP404Error("Specified group or user doesn't exist", {
        userId,
        groupIds
      });
    }

    const response = responseBuilder.createResponse(user);
    res.json(response);
  }

  static async deleteGroupFromUser(req, res) {
    const { userId, groupId } = req.params;
    const result = await UsersService.removeGroup(userId, groupId);

    if (result === null) {
      throw new HTTP404Error(
        "Specified user or group or relation between them doesn't exist",
        { userId, groupId }
      );
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
      throw new HTTP404Error('user not found', { userId });
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }
}
