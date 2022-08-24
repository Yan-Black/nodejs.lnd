import LoginService from '../service/login';
import HTTP400Error from '../errorHandler/HTTP400Error';
import { responseBuilder } from '../helpers/ResponseBuilder';

export default class LoginController {
  static async getJWT(req, res) {
    const { userName, password } = req.body;
    const token = await LoginService.getToken(userName, password);

    if (!token) {
      throw new HTTP400Error('invalid username or password');
    }

    const response = responseBuilder.createResponse({ token });
    res.json(response);
  }
}
