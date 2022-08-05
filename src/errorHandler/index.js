import { centralizedHandler } from './CentralizedHandler';
import { httpStatusCode } from '../constants';

export const errorHandler = (err, req, res, next) => {
  if (!centralizedHandler.isOperational(err)) {
    next(err);
  }

  centralizedHandler.handleError(err);

  const { statusCode, responseMessage } = centralizedHandler;

  const status = statusCode ?? err.statusCode ?? httpStatusCode.INTERNAL_SERVER;
  const message = responseMessage ?? err.message;

  res.status(status).send(message);
};
