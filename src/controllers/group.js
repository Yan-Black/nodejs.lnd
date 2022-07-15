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
