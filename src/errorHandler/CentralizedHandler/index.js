import { Sequelize } from 'sequelize';
import BaseError from '../BaseError';
import { logger } from '../../logger';
import { httpStatusCode } from '../../constants';

class ErrorHandler {
  responseMessage;

  statusCode;

  #isOpError = false;

  handleError(error) {
    if (error instanceof Sequelize.ValidationError) {
      this.handleSequelizeValidationError(error);
      return;
    }

    this.responseMessage = error.message || httpStatusCode.INTERNAL_SERVER;
    this.statusCode = error.statusCode || 'internal server';

    logger.error('centralized error-handler message:', error);
  }

  handleSequelizeValidationError(error) {
    this.responseMessage = error.parent.detail;
    this.statusCode = httpStatusCode.BAD_REQUEST;

    logger.error(
      `centralized error-handler message: ${this.responseMessage}`,
      error.parent
    );
  }

  isOperational(error) {
    if (error instanceof BaseError) {
      this.#isOpError = error.isOperational;
      return this.#isOpError;
    }

    return this.#isOpError;
  }
}

export const centralizedHandler = new ErrorHandler();
