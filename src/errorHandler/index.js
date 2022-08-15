import { centralizedHandler } from './CentralizedHandler';

export const errorHandler = (err, req, res, next) => {
  if (!centralizedHandler.isOperational(err)) {
    next(err);
  }

  centralizedHandler.handleError(err);

  res
    .status(centralizedHandler.statusCode)
    .send(centralizedHandler.responseMessage);
};
