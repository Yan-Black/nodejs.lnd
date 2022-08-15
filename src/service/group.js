import { db } from '../database/models';

const { Group, User, sequelize } = db;

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

  static async getAssociatedUser(groupId, userId) {
    const group = await Group.findByPk(groupId);

    if (!group) {
      return null;
    }

    const user = await User.findByPk(userId, {
      include: {
        model: Group,
        as: 'groups',
        through: { attributes: [] }
      },
      ...GroupService.excludeAttributes
    });

    if (!user) {
      return null;
    }

    const hasUser = group.hasUser(user);

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
      ...GroupService.excludeAttributes,
      joinTableAttributes: []
    });

    if (!users) {
      return null;
    }

    return users;
  }

  static async addUsers(groupId, userIds) {
    const addUsersTransaction = (transaction) => {
      const dbTransactionPromises = (
        Array.isArray(userIds) ? userIds : [userIds]
      ).map(async (userId) => {
        const group = await Group.findByPk(groupId, {
          ...GroupService.associate,
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
      });

      return Promise.all(dbTransactionPromises);
    };

    const results = await sequelize.transaction(addUsersTransaction);
    const [group] = results.filter(Boolean).reverse();

    if (group) {
      const users = await group.getUsers({
        ...GroupService.excludeAttributes,
        joinTableAttributes: []
      });

      return users;
    }

    return [];
  }

  static async removeUser(groupId, userId) {
    const removeUserTransaction = async (transaction) => {
      const group = await Group.findByPk(groupId, {
        transaction
      });

      if (!group) {
        return null;
      }

      if (userId) {
        const user = await User.findByPk(userId, { transaction });

        if (!user) {
          return null;
        }

        const result = await group.removeUser(user, { transaction });
        return Boolean(result);
      }

      const groupUsers = await group.getUsers({ transaction });
      const result = await group.removeUsers(groupUsers, { transaction });

      return Boolean(result);
    };

    const result = await sequelize.transaction(removeUserTransaction);
    return result;
  }

  static async create(groupDTO) {
    const [group] = await Group.findOrCreate({
      where: {
        ...groupDTO
      }
    });

    return group;
  }

  static async update(id, groupDTO) {
    const group = await Group.findByPk(id, { ...GroupService.associate });

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
