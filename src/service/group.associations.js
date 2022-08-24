import GroupService from './group';
import { db } from '../database/models';

const { Group, User, sequelize } = db;

export default class GroupServiceAssociations extends GroupService {
  static async getAssociatedUser(groupId, userId) {
    const group = await Group.findByPk(groupId);

    if (!group) {
      return null;
    }

    const user = await User.findByPk(userId, {
      ...super.excludeAttributes
    });

    if (!user) {
      return null;
    }

    const hasUser = await group.hasUser(user);

    if (hasUser) {
      return user;
    }

    return null;
  }

  static async getAssociatedUsers(id) {
    const group = await Group.findByPk(id);

    if (!group) {
      return null;
    }

    const users = await group.getUsers({
      ...super.excludeAttributes,
      joinTableAttributes: []
    });

    return users;
  }

  static async addUser(groupId, userId) {
    const addUserTransaction = async (transaction) => {
      const group = await Group.findByPk(groupId, {
        ...super.associate,
        transaction
      });

      if (!group) {
        return null;
      }

      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        return null;
      }

      const hasUser = await group.hasUser(user, { transaction });

      if (hasUser) {
        return group;
      }

      await group.addUser(user, { transaction });
      await group.reload({
        transaction
      });

      return group;
    };

    const group = await sequelize.transaction(addUserTransaction);
    return group;
  }

  static async addUsers(groupId, userIds) {
    const addUsersTransaction = async (transaction) => {
      const group = await Group.findByPk(groupId, {
        ...super.associate,
        transaction
      });

      if (!group) {
        return null;
      }

      const dbTransactionPromises = userIds.map(async (userId) => {
        const user = await User.findByPk(userId, { transaction });

        if (!user) {
          return null;
        }

        const hasUser = await group.hasUser(user, { transaction });

        if (hasUser) {
          return group;
        }

        await group.addUser(user, { transaction });
        await group.reload({
          transaction
        });

        return group;
      });

      const results = await Promise.all(dbTransactionPromises);

      if (results.includes(null)) {
        return null;
      }

      return results.reverse()[0];
    };

    const result = await sequelize.transaction(addUsersTransaction);
    return result;
  }

  static async removeUser(groupId, userId) {
    const removeUserTransaction = async (transaction) => {
      const group = await Group.findByPk(groupId, {
        transaction
      });

      if (!group) {
        return null;
      }

      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        return null;
      }

      const result = await group.removeUser(user, { transaction });
      return Boolean(result);
    };

    const result = await sequelize.transaction(removeUserTransaction);
    return result;
  }

  static async removeUsers(groupId) {
    const removeUsersTransaction = async (transaction) => {
      const group = await Group.findByPk(groupId, {
        transaction
      });

      if (!group) {
        return null;
      }

      const groupUsers = await group.getUsers({ transaction });
      const result = await group.removeUsers(groupUsers, { transaction });

      return Boolean(result);
    };

    const result = await sequelize.transaction(removeUsersTransaction);
    return result;
  }
}
