import ErrorHandler from './CentralizedHandler';
import { logger } from '../logger';

export const errorHandler = (err, req, res, next) => {
  if (!ErrorHandler.isOperational(err)) {
    next(err);
  }

  ErrorHandler.handleError(err, logger);
};
