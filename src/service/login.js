import jwt from 'jsonwebtoken';
import { db } from '../database/models';

const { User } = db;

export default class LoginService {
  static secret =
    'PUdOTyxvG427pUPDHKd1rMRKJU9sqAv6giC2LDLIT6SwR9UMDkEtWy5Q2u+tEK/c4v4fBIOdRvLsjQDTOEV6s5lHMR0Q8vojHQ5h9ZfXzXLUF5LYpk32TDPNL6wFEogexQYzkptOZVgPb4D96M7B84WEa8B2ieW7AeXb3lD5FbWzuJerpQ1nb1/yVaLufmSfoaww7J6ww/H3NArqI5qH9o+sBHGI6oOdX9VtFJqtN50apKX5oDifQyE9cZtQ3WSJ1STqyH0bCWIFgJw/ue7Fg1ojFLtvDk3MOAytchZ7iE0SSkA5WwyYfY5ksDLzA/JzVcgKaWigzl5lGkVouRuT7w==';

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
      const token = jwt.sign(
        { id: user.getDataValue('id') },
        LoginService.secret,
        {
          expiresIn: 600
        }
      );

      return token;
    }

    return null;
  }
}
