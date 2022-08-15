import jwt from 'jsonwebtoken';
import HTTP401Error from '../errorHandler/HTTP401Error';
import HTTP403Error from '../errorHandler/HTTP403Error';

const { JWT_SECRET } = process.env;

export const authenticate = (req, res, next) => {
  // next();
  const { authorization: bearerHeader } = req.headers;

  if (!bearerHeader) {
    throw new HTTP401Error('unauthorized');
  }

  const token = bearerHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err) => {
    if (err) {
      throw new HTTP403Error('forbidden');
    } else {
      next();
    }
  });
};
