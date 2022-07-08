import GroupService from '../service/group';
import APIError from '../errorHandler/APIError';
import { httpStatusCode } from '../constants';

export default class GroupController {
  static async getGroups(req, res) {
    const groups = await GroupService.getAll();

    res.json(groups);
  }

  static async getGroupById(req, res) {
    const { id } = req.params;

    const group = await GroupService.getById(id);

    if (!group) {
      throw new APIError({
        name: 'not found',
        statusCode: httpStatusCode.NOT_FOUND,
        isOperational: true,
        description: `no group found by id: ${id}`
      });
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
      throw new APIError(
        'not found',
        httpStatusCode.NOT_FOUND,
        true,
        `no group found by id: ${id}`
      );
    }

    res.send({
      message: 'Group was updated successfully.'
    });
  }

  static async deleteGroup(req, res) {
    const { id } = req.params;

    const isSuccess = await GroupService.delete(id);

    if (!isSuccess) {
      throw new APIError(
        'not found',
        httpStatusCode.NOT_FOUND,
        true,
        `no group found by id: ${id}`
      );
    }

    res.send({
      message: 'Group was deleted successfully.'
    });
  }
}
