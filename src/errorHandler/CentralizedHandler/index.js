/* eslint-disable no-process-exit */
import BaseError from '../BaseError';
import { httpStatusCode } from '../../constants';
import { logger } from '../../logger';

export default class ErrorHandler {
  static handleError(err, req, res, next) {
    if (!ErrorHandler.isOperational(err)) {
      next(err);
    }

    logger.error('centralized error-handler message:', err);

    res
      .status(err.statusCode || httpStatusCode.INTERNAL_SERVER)
      .send({ error: err.message });
  }

  static isOperational(error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }

    return false;
  }

  static handleUnhandledRejection(reason) {
    throw reason;
  }

  static handleUncaughtException(error) {
    logger.error('centralized error-handler message:', error);

    if (!ErrorHandler.isOperational(error)) {
      process.exit(1);
    }
  }
}
