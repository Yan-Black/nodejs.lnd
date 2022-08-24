import GroupService from '../service/group';
import HTTP404Error from '../errorHandler/HTTP404Error';
import HTTP410Error from '../errorHandler/HTTP410Error';
import HTTP400Error from '../errorHandler/HTTP400Error';
import { responseBuilder } from '../helpers/ResponseBuilder';
import { httpStatusCode } from '../constants';

export default class GroupsController {
  static async getGroups(req, res) {
    const groups = await GroupService.getAll();
    const response = responseBuilder.createResponse(groups);

    res.json(response);
  }

  static async getGroupById(req, res) {
    const { groupId } = req.params;
    const group = await GroupService.getById(groupId);

    if (!group) {
      throw new HTTP404Error('group not found', { groupId });
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async createGroup(req, res) {
    const { body: groupDTO } = req;
    const group = await GroupService.create(groupDTO);

    if (!group) {
      throw new HTTP400Error('group already exists');
    }

    const response = responseBuilder.createResponse(group);
    res.status(httpStatusCode.OK_NEW_RESOURCE_CREATED).json(response);
  }

  static async updateGroup(req, res) {
    const { groupId } = req.params;
    const { body: groupDTO } = req;

    const group = await GroupService.update(groupId, groupDTO);

    if (!group) {
      throw new HTTP404Error('group not found', { groupId });
    }

    const response = responseBuilder.createResponse(group);
    res.json(response);
  }

  static async deleteGroup(req, res) {
    const { groupId } = req.params;
    const result = await GroupService.delete(groupId);

    if (result === null) {
      throw new HTTP404Error('group not found', { groupId });
    }

    if (result === false) {
      throw new HTTP410Error();
    }

    res.status(httpStatusCode.OK_NO_CONTENT).end();
  }
}
