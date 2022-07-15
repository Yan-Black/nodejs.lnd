import ErrorHandler from './CentralizedHandler';
import { httpStatusCode } from '../constants';

export const errorHandler = (err, req, res, next) => {
  if (!ErrorHandler.isOperational(err)) {
    next(err);
  }

  ErrorHandler.handleError(err);

  res
    .status(err.statusCode || httpStatusCode.INTERNAL_SERVER)
    .send(err.message);
};
