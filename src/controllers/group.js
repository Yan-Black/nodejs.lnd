import GroupService from '../service/group';
import { responseStatuses } from '../constants';

export default class GroupController {
  static async getGroups(req, res) {
    const groups = await GroupService.getAll();

    res.json(groups);
  }

  static async getGroupById(req, res) {
    const { id } = req.params;

    const group = await GroupService.getById(id);

    group
      ? res.send(group)
      : res
          .status(responseStatuses.notFoundStatus)
          .send(`no group found by id: ${id}`);
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

    isSuccess
      ? res.send({
          message: 'Group was updated successfully.'
        })
      : res
          .status(responseStatuses.notFoundStatus)
          .send(`no group found by id: ${id}`);
  }

  static async deleteGroup(req, res) {
    const { id } = req.params;

    const isSuccess = await GroupService.delete(id);

    isSuccess
      ? res.send({
          message: 'Group was deleted successfully!'
        })
      : res
          .status(responseStatuses.notFoundStatus)
          .send(`no group found by id: ${id}`);
  }
}
