import GroupService from '../service/group';
import HTTP404Error from '../errorHandler/HTTP404Error';
import HTTP410Error from '../errorHandler/HTTP410Error';
import { httpStatusCode } from '../constants';

export default class GroupController {
  static async getGroups(req, res) {
    const groups = await GroupService.getAll();
    res.json({ data: groups });
  }

  static async getGroupById(req, res) {
    const { id } = req.params;
    const group = await GroupService.getById(id);

    if (!group) {
      throw new HTTP404Error(`no group found by id: ${id}`);
    }

    res.send(group);
  }

  static async getAssociatedUser(req, res) {
    const { groupId, userId } = req.params;
    const user = await GroupService.getAssociatedUser(groupId, userId);

    if (!user) {
      throw new HTTP404Error(
        `users with id: ${userId} or group with id: ${groupId} not found`
      );
    }

    res.send(user);
  }

  static async getAssociatedUsersByGroupId(req, res) {
    const { id } = req.params;
    const users = await GroupService.getAssociatedUsers(id);

    if (!users) {
      throw new HTTP404Error(
        `no users found for group with id: ${id} or this group doesn't exist`
      );
    }

    res.send({ data: users });
  }

  static async addUsersToGroup(req, res) {
    const { groupId, userId } = req.params;
    const { userIds } = req.body;

    const users = await GroupService.addUsers(groupId, userIds || userId);

    res.json({ data: users });
  }

  static async createGroup(req, res) {
    const { body: groupDTO } = req;
    const group = await GroupService.create(groupDTO);

    res.json(group);
  }

  static async updateGroup(req, res) {
    const { id } = req.params;
    const { body: groupDTO } = req;

    const group = await GroupService.update(id, groupDTO);

    if (!group) {
      throw new HTTP404Error(`no group found by id: ${id}`);
    }

    res.json(group);
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
}
