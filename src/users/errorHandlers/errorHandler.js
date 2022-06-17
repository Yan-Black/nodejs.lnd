import { responseStatuses } from '../constants';

export const errorHandler = (err, req, res, next) => {
  global.console.error(err.stack);
  res.status(responseStatuses.serverErrorStatus).send({ message: 'error' });
  next();
};
