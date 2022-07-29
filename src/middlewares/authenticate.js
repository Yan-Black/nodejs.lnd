import jwt from 'jsonwebtoken';
import HTTP401Error from '../errorHandler/HTTP401Error';
import HTTP403Error from '../errorHandler/HTTP403Error';

const { JWT_SECRET } = process.env;

export const authenticate = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  const token = bearerHeader?.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) {
        throw new HTTP403Error('forbidden');
      } else {
        next();
      }
    });
  } else {
    throw new HTTP401Error('unauthorized');
  }
};
