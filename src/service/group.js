import { db } from '../database/models';

const { Group } = db;

export default class GroupService {
  static async getAll() {
    const users = await Group.findAll();

    return users;
  }

  static async getById(id) {
    const user = await Group.findByPk(id);

    return user;
  }

  static async create(userDTO) {
    const { id } = await Group.create(userDTO);

    return id;
  }

  static async update(id, userDTO) {
    const [num] = await Group.update(userDTO, { where: { id } });

    return num === 1;
  }

  static async delete(id) {
    const num = await Group.destroy({ where: { id } });

    return num === 1;
  }
}
