import { httpStatusCode } from '../../constants';

class ResponseBuilder {
  #errorCodeMap = {
    [httpStatusCode.BAD_REQUEST]: 1,
    [httpStatusCode.UNAUTHORIZED]: 2,
    [httpStatusCode.FORBIDDEN]: 3,
    [httpStatusCode.NOT_FOUND]: 4,
    [httpStatusCode.INTERNAL_SERVER]: 5,
    [httpStatusCode.GONE]: 6
  };

  #response = {};

  #defaultErrorMessage = 'internal server';

  createResponse(data) {
    this.#response = {
      data
    };

    return this.#response;
  }

  createErrorResponse(
    message = this.#defaultErrorMessage,
    statusCode = httpStatusCode.INTERNAL_SERVER,
    details = {}
  ) {
    this.#response = {
      error: {
        code: this.#errorCodeMap[statusCode],
        message,
        details
      }
    };

    return this.#response;
  }
}

export const responseBuilder = new ResponseBuilder();
