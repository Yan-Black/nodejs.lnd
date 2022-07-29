import { db } from '../database/models';

const { Group, UserGroup, sequelize } = db;

export default class GroupService {
  static async getAll() {
    const users = await Group.findAll();

    return users;
  }

  static async getById(id) {
    const user = await Group.findByPk(id);

    return user;
  }

  static async getAssociatedUsers(id) {
    const group = await Group.findByPk(id);

    if (!group) {
      return null;
    }

    const users = await group.getUsers();

    if (!users) {
      return null;
    }

    return users;
  }

  static async addUsersToGroup(groupId, userIds) {
    const userGroup = await sequelize.transaction(async (transaction) => {
      return Promise.all(
        userIds.map((userId) =>
          UserGroup.create(
            {
              GroupId: groupId,
              UserId: userId
            },
            { transaction }
          )
        )
      );
    });

    return userGroup;
  }

  static async create(groupDTO) {
    const { id } = await Group.create(groupDTO);

    return id;
  }

  static async update(id, groupDTO) {
    const [num] = await Group.update(groupDTO, { where: { id } });

    return num === 1;
  }

  static async delete(id) {
    const num = await Group.destroy({ where: { id } });

    return num === 1;
  }
}
