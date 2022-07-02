import { db } from '../database/models';

const { User, UserGroup, sequelize } = db;
const { Op } = db.Sequelize;
const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

export default class UsersService {
  static async addUsersToGroup(groupId, userIds) {
    try {
      await sequelize.transaction(async (transaction) => {
        (Array.isArray(userIds) ? userIds : [userIds]).forEach(
          async (userId) => {
            await UserGroup.create(
              {
                groupId,
                userId
              },
              { transaction }
            );
          }
        );
      });
    } catch (error) {
      global.console.error(error);
    }
  }

  static async getAll(loginSubstring = '', limit = 10, offset = 0) {
    const users = await User.findAll({
      attributes,
      where: { login: { [Op.iLike]: `%${loginSubstring}` } },
      limit,
      offset
    });

    return users;
  }

  static async getById(id) {
    const user = await User.findByPk(id, {
      attributes
    });

    return user;
  }

  static async create(userDTO) {
    const {
      dataValues: { id }
    } = await User.create(userDTO);

    return id;
  }

  static async update(id, userDTO) {
    const [num] = await User.update(userDTO, { where: { id } });

    return num === 1;
  }

  static async delete(id) {
    const num = await User.destroy({ where: { id } });

    return num === 1;
  }
}
