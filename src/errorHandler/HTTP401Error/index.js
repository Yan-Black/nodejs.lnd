import APIError from '../APIError';
import { httpStatusCode } from '../../constants';

export default class HTTP401Error extends APIError {
  constructor(description = 'invalid credentials') {
    super({
      name: 'Unauthorized',
      statusCode: httpStatusCode.UNAUTHORIZED,
      description,
      isOperational: true
    });
  }
}
