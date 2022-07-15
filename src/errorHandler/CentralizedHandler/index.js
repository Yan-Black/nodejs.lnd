import BaseError from '../BaseError';
import { logger } from '../../logger';

export default class ErrorHandler {
  static handleError(err) {
    logger.error('centralized error-handler message:', err);
  }

  static isOperational(error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }

    return false;
  }
}
