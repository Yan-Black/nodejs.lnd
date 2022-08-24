import { db } from '../database/models';

const { Group, User } = db;

export default class GroupService {
  static excludeAttributes = {
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
  };

  static associate = {
    include: [
      {
        model: User,
        as: 'users',
        through: { attributes: [] },
        ...GroupService.excludeAttributes
      }
    ]
  };

  static async getAll() {
    const users = await Group.findAll({
      ...GroupService.associate
    });

    return users;
  }

  static async getById(id) {
    const user = await Group.findByPk(id, GroupService.associate);
    return user;
  }

  static async create(groupDTO) {
    const [group, created] = await Group.findOrCreate({
      where: {
        ...(groupDTO.id && { id: groupDTO.id }),
        ...(groupDTO.name && { name: groupDTO.name })
      },
      defaults: {
        ...groupDTO
      }
    });

    return created ? group : null;
  }

  static async update(id, groupDTO) {
    const group = await Group.findByPk(id);

    if (!group) {
      return null;
    }

    await Group.update(groupDTO, { where: { id } });
    await group.reload();

    return group;
  }

  static async delete(id) {
    const group = await Group.findByPk(id);

    if (!group) {
      return null;
    }

    const result = await Group.destroy({ where: { id } });
    return Boolean(result);
  }
}
