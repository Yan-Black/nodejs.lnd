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

  static async addUser(groupId, userIds) {
    const transactionCallBack = (transaction) => {
      const transactions = (Array.isArray(userIds) ? userIds : [userIds]).map(
        (userId) =>
          UserGroup.create(
            {
              GroupId: groupId,
              UserId: userId
            },
            { transaction }
          )
      );

      return Promise.all(transactions);
    };

    const userGroup = await sequelize.transaction(transactionCallBack);

    return userGroup;
  }

  static async removeUser(groupId, userIds) {
    const transactionCallBack = (transaction) => {
      const transactions = (Array.isArray(userIds) ? userIds : [userIds]).map(
        (userId) =>
          UserGroup.destroy(
            {
              where: {
                GroupId: groupId,
                UserId: userId
              }
            },
            { transaction }
          )
      );

      return Promise.all(transactions);
    };

    const [result] = await sequelize.transaction(transactionCallBack);

    return Boolean(result);
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
