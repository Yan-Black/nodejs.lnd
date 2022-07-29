import APIError from '../APIError';
import { httpStatusCode } from '../../constants';

export default class HTTP400Error extends APIError {
  constructor(description = 'bad request') {
    super({
      name: 'invalid request data',
      statusCode: httpStatusCode.BAD_REQUEST,
      description,
      isOperational: true
    });
  }
}
