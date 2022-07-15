import APIError from '../APIError';
import { httpStatusCode } from '../../constants';

export default class HTTP404Error extends APIError {
  constructor(description = 'requested entity not found') {
    super({
      name: 'Not Found',
      statusCode: httpStatusCode.NOT_FOUND,
      description,
      isOperational: true
    });
  }
}
