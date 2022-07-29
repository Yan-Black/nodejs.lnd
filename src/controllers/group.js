import GroupService from '../service/group';
import HTTP404Error from '../errorHandler/HTTP404Error';
import HTTP400Error from '../errorHandler/HTTP400Error';

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

  static async getAssociatedUsersByUserId(req, res) {
    const { id } = req.params;

    const users = await GroupService.getAssociatedUsers(id);

    if (!users) {
      throw new HTTP404Error(`no groups found by user id: ${id}`);
    }

    res.send(users);
  }

  static async addUsersToGroup(req, res) {
    const { id: groupId } = req.params;
    const { users } = req.body;

    const userGroup = await GroupService.addUsersToGroup(groupId, users);

    if (!userGroup) {
      throw new HTTP400Error();
    }

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

    res.send({
      message: 'Group was updated successfully.'
    });
  }

  static async deleteGroup(req, res) {
    const { id } = req.params;

    const isSuccess = await GroupService.delete(id);

    if (!isSuccess) {
      throw new HTTP404Error(`no group found by id: ${id}`);
    }

    res.send({
      message: 'Group was deleted successfully.'
    });
  }
}
