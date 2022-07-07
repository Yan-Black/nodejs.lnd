import BaseError from '../BaseError';
import { httpStatusCode } from '../../constants';

export default class APIError extends BaseError {
  constructor({
    name,
    httpCode = httpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = 'internal server error'
  }) {
    super({ name, httpCode, description, isOperational });
  }
}
