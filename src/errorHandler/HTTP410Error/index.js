import APIError from '../APIError';
import { httpStatusCode } from '../../constants';

export default class HTTP410Error extends APIError {
  constructor(description = 'resource already deleted') {
    super({
      name: 'Gone',
      statusCode: httpStatusCode.GONE,
      description,
      isOperational: true
    });
  }
}
