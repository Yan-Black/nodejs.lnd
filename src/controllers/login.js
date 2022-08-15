import LoginService from '../service/login';
import HTTP403Error from '../errorHandler/HTTP403Error';

export default class LoginController {
  static async getJWT(req, res) {
    const { userName, password } = req.body;

    const token = await LoginService.getToken(userName, password);

    if (!token) {
      throw new HTTP403Error('invalid username or password');
    }

    res.send({ token });
  }
}
