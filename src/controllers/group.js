import GroupService from '../service/group';
import HTTP404Error from '../errorHandler/HTTP404Error';

export default class GroupController {
  static async getGroups(req, res) {
    const groups = await GroupService.getAll();

    res.json(groups);
  }

  static async getGroupById(req, res) {
    const { id } = req.params;

    const group = await GroupService.getById(id);

    if (!group) {
      throw new HTTP404Error(`no group found by id: ${id}`);
    }

    res.send(group);
  }

  static async getAssociatedUsersByGroupId(req, res) {
    const { id } = req.params;

    const users = await GroupService.getAssociatedUsers(id);

    if (!users) {
      throw new HTTP404Error(`no users found for group with id: ${id}`);
    }

    res.send(users);
  }

  static async addUsersToGroup(req, res) {
    const { groupId, userId } = req.params;
    const { users } = req.body;

    const userGroup = await GroupService.addUser(groupId, users || userId);

    res.json(userGroup);
  }

  static async createGroup(req, res) {
    const { body: groupDTO } = req;

    const id = await GroupService.create(groupDTO);

    res.json({ id });
  }

  static async updateGroup(req, res) {
    const { id } = req.params;
    const { body: groupDTO } = req;

    const isSuccess = await GroupService.update(id, groupDTO);

    if (!isSuccess) {
      throw new HTTP404Error(`no group found by id: ${id}`);
    }

    res.send('Group was updated successfully.');
  }

  static async deleteGroup(req, res) {
    const { id } = req.params;

    const isSuccess = await GroupService.delete(id);

    if (!isSuccess) {
      throw new HTTP404Error(`no group found by id: ${id}`);
    }

    res.send('Group was deleted successfully.');
  }

  static async deleteUserFromAGroup(req, res) {
    const { userId, groupId } = req.params;

    const isSuccess = await GroupService.removeUser(groupId, userId);

    if (!isSuccess) {
      throw new HTTP404Error(
        `no user group relation found\n user id: ${userId}\n group id: ${groupId}`
      );
    }

    res.send(`User was successfully removed from a group with id:${groupId}.`);
  }
}
