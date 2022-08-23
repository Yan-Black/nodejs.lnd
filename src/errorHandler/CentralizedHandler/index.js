import { Sequelize } from 'sequelize';
import BaseError from '../BaseError';
import { logger } from '../../logger';
import { httpStatusCode } from '../../constants';

export default class ErrorHandler {
  responseMessage;

  statusCode;

  details;

  meta = {};

  static errorPrefix = 'centralized error-handler message:';

  #setErrorInfo(message, status, details) {
    this.responseMessage = message;
    this.statusCode = status;
    this.details = details;
  }

  #handleSequilizeDatabaseError(error) {
    this.#setErrorInfo(error.message, httpStatusCode.BAD_REQUEST, {});
    logger.error(ErrorHandler.errorPrefix, error);
  }

  #handleSequelizeValidationError(error) {
    this.#setErrorInfo(error.parent.detail, httpStatusCode.BAD_REQUEST, {});
    logger.error(
      `${ErrorHandler.errorPrefix} ${this.responseMessage}`,
      error.parent
    );
  }

  handleError(error) {
    if (error.name === 'SequelizeDatabaseError') {
      this.#handleSequilizeDatabaseError(error);
      return;
    }

    if (error instanceof Sequelize.ValidationError) {
      this.#handleSequelizeValidationError(error);
      return;
    }

    this.#setErrorInfo(
      error.message || 'internal server',
      error.statusCode || httpStatusCode.INTERNAL_SERVER,
      error.details
    );

    logger.error(ErrorHandler.errorPrefix, error);
  }

  static isOperational(error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }

    return false;
  }
}

export const centralizedHandler = new ErrorHandler();
