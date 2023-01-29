import BaseError from '../BaseError';
import { httpStatusCode } from '../../constants';

export default class APIError extends BaseError {
  constructor({
    name,
    statusCode = httpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = 'internal server error',
    details = {}
  }) {
    super({ name, statusCode, description, isOperational, details });
  }
}
