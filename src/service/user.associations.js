import UsersService from './user';
import { db } from '../database/models';

const { Group, User, sequelize } = db;

export default class UserServiceAssociations extends UsersService {
  static async getAssociatedGroup(userId, groupId) {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    const group = await Group.findByPk(groupId);

    if (!group) {
      return null;
    }

    const hasGroup = await user.hasGroup(group);

    if (hasGroup) {
      return group;
    }

    return null;
  }

  static async getAssociatedGroups(id) {
    const user = await User.findByPk(id);

    if (!user) {
      return null;
    }

    const groups = await user.getGroups({
      joinTableAttributes: []
    });
    return groups;
  }

  static async addGroup(userId, groupId) {
    const addGroupTransaction = async (transaction) => {
      const user = await User.findByPk(userId, {
        ...super.excludeAttributes,
        ...super.associate,
        transaction
      });

      if (!user) {
        return null;
      }

      const group = await Group.findByPk(groupId, { transaction });

      if (!group) {
        return null;
      }

      const hasGroup = await user.hasGroup(group, { transaction });

      if (hasGroup) {
        return user;
      }

      await user.addGroup(group, { transaction });
      await user.reload({ ...super.excludeAttributes, transaction });

      return user;
    };

    const user = await sequelize.transaction(addGroupTransaction);
    return user;
  }

  static async addGroups(userId, groupIds) {
    const addGroupsTransaction = async (transaction) => {
      const user = await User.findByPk(userId, {
        ...super.excludeAttributes,
        ...super.associate,
        transaction
      });

      if (!user) {
        return null;
      }

      const dbTransactionPromises = groupIds.map(async (groupId) => {
        const group = await Group.findByPk(groupId, { transaction });

        if (!group) {
          return null;
        }

        const hasGroup = await user.hasGroup(group, { transaction });

        if (hasGroup) {
          return user;
        }

        await user.addGroup(group, { transaction });
        await user.reload({ ...super.excludeAttributes, transaction });

        return user;
      });

      const results = await Promise.all(dbTransactionPromises);

      if (results.includes(null)) {
        return null;
      }

      return results.reverse()[0];
    };

    const result = await sequelize.transaction(addGroupsTransaction);
    return result;
  }

  static async removeGroup(userId, groupId) {
    const removeGroupTransaction = async (transaction) => {
      const user = await User.findByPk(userId, {
        transaction
      });

      if (!user) {
        return null;
      }

      const group = await Group.findByPk(groupId, { transaction });

      if (!group) {
        return null;
      }

      const result = await user.removeGroup(group, { transaction });
      return Boolean(result);
    };

    const result = await sequelize.transaction(removeGroupTransaction);
    return result;
  }

  static async removeGroups(userId) {
    const removeGroupsTransaction = async (transaction) => {
      const user = await User.findByPk(userId, {
        transaction
      });

      if (!user) {
        return null;
      }

      const userGroups = await user.getGroups({ transaction });
      const result = await user.removeGroups(userGroups, { transaction });

      return Boolean(result);
    };

    const result = await sequelize.transaction(removeGroupsTransaction);
    return result;
  }
}
