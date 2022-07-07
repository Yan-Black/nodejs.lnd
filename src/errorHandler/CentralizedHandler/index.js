import BaseError from '../BaseError';

export default class ErrorHandler {
  static handleError(err, logger) {
    logger.error('centralized error-handler:', err);
  }

  static isOperational(error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }

    return false;
  }
}
