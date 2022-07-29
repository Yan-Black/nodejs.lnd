import jwt from 'jsonwebtoken';
import { db } from '../database/models';

const { User } = db;
const { JWT_SECRET } = process.env;

export default class LoginService {
  static async getToken(login, password) {
    if (!login || !password) {
      return null;
    }

    const user = await User.findOne({
      where: {
        login,
        password
      }
    });

    if (user) {
      const token = jwt.sign({ id: user.getDataValue('id') }, JWT_SECRET, {
        expiresIn: 600
      });

      return token;
    }

    return null;
  }
}
