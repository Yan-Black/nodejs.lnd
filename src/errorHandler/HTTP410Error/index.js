import APIError from '../APIError';
import { httpStatusCode } from '../../constants';

export default class HTTP410Error extends APIError {
  constructor(description = 'resource already deleted', details = {}) {
    super({
      name: 'Gone',
      statusCode: httpStatusCode.GONE,
      description,
      isOperational: true,
      details
    });
  }
}
