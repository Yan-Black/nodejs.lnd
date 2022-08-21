import { db } from '../database/models';

const { User, Group, UserGroup, sequelize } = db;
const { Op } = db.Sequelize;

export default class UsersService {
  static excludeAttributes = {
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
  };

  static associate = {
    include: [{ model: Group, as: 'groups', through: { attributes: [] } }]
  };

  static async getAll(loginSubstring = '', limit = 10, offset = 0) {
    const users = await User.findAll({
      ...UsersService.excludeAttributes,
      ...UsersService.associate,
      where: { login: { [Op.iLike]: `%${loginSubstring}%` } },
      limit,
      offset
    });

    return users;
  }

  static async getById(id) {
    const user = await User.findByPk(id, {
      ...UsersService.excludeAttributes,
      ...UsersService.associate
    });

    return user;
  }

  static async getAssociatedGroup(userId, groupId) {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    const group = await Group.findByPk(groupId, {
      include: {
        model: User,
        as: 'users',
        through: { attributes: [] },
        ...UsersService.excludeAttributes
      }
    });

    if (!group) {
      return null;
    }

    const hasGroup = user.hasGroup(group);

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

    const groups = await user.getGroups({ joinTableAttributes: [] });

    if (!groups) {
      return null;
    }

    return groups;
  }

  static async addGroups(userId, groupIds) {
    const addGroupsTransaction = (transaction) => {
      const dbTransactionPromises = (
        Array.isArray(groupIds) ? groupIds : [groupIds]
      ).map(async (groupId) => {
        const user = await User.findByPk(userId, {
          ...UsersService.excludeAttributes,
          ...UsersService.associate,
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
        await user.reload({ ...UsersService.excludeAttributes, transaction });

        return user;
      });

      return Promise.all(dbTransactionPromises);
    };

    const results = await sequelize.transaction(addGroupsTransaction);
    const [user] = results.filter(Boolean).reverse();

    if (user) {
      const groups = user.getGroups({ joinTableAttributes: [] });
      return groups;
    }

    return [];
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

  static async create(userDTO) {
    const [user, created] = await User.findOrCreate({
      where: {
        ...(userDTO.id && { id: userDTO.id })
      },
      defaults: {
        ...userDTO
      }
    });

    return created ? user : null;
  }

  static async update(id, userDTO) {
    const user = await User.findByPk(id, {
      ...UsersService.excludeAttributes,
      ...UsersService.associate
    });

    if (!user) {
      return null;
    }

    await User.update(userDTO, {
      where: { id }
    });
    await user.reload({
      ...UsersService.excludeAttributes,
      ...UsersService.associate
    });

    return user;
  }

  static async delete(id) {
    const deleteUserTransaction = async (transaction) => {
      const user = await User.findByPk(id, { transaction });

      if (!user) {
        return null;
      }

      const result = await User.destroy({
        where: { id },
        transaction
      });
      /* Manual joint table record deletion.
      Not supported in Sequilize for paranoid tables. */
      if (result) {
        await UserGroup.destroy({
          where: {
            UserId: id
          },
          transaction
        });
      }

      return Boolean(result);
    };

    const result = sequelize.transaction(deleteUserTransaction);
    return result;
  }
}
