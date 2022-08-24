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

  static async create(userDTO) {
    const createUserTransaction = async (transaction) => {
      let user = null;

      if (userDTO.id) {
        user = await User.findByPk(userDTO.id, { transaction });
      }

      if (user) {
        return null;
      }

      const created = await User.create(userDTO, { transaction, hooks: true });
      return created;
    };

    const user = await sequelize.transaction(createUserTransaction);
    return user;
  }

  static async update(id, userDTO) {
    const user = await User.findByPk(id, {
      ...UsersService.excludeAttributes
    });

    if (!user) {
      return null;
    }

    await User.update(userDTO, {
      where: { id }
    });
    await user.reload({
      ...UsersService.excludeAttributes
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
