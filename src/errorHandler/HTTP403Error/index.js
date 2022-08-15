import APIError from '../APIError';
import { httpStatusCode } from '../../constants';

export default class HTTP403Error extends APIError {
  constructor(description = 'forbidden') {
    super({
      name: 'Forbidden',
      statusCode: httpStatusCode.FORBIDDEN,
      description,
      isOperational: true
    });
  }
}
