import { db } from '../models';

const { User } = db;
const { Op } = db.Sequelize;
const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

export default class UsersService {
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
    const { id } = await User.create(userDTO);

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
