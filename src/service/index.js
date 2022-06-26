export default class UsersService {
  constructor(model, excludeAttributes) {
    this.model = model;
    this.excludeOptions = {
      attributes: {
        exclude: excludeAttributes
      }
    };
  }

  static async getAll() {
    const list = await this.model.findAll(this.excludeOptions);

    return list;
  }

  static async getById(id) {
    const result = await this.model.findByPk(id, this.excludeOptions);

    return result;
  }

  static async create(body) {
    const { id } = await this.model.create(body);

    return id;
  }

  static async update(id, body) {
    const [num] = await this.model.update(body, { where: { id } });

    return num;
  }

  static async delete(id) {
    const num = await this.model.destroy({ where: { id } });

    return num;
  }
}
