import { httpStatusCode } from '../../constants';

class ResponseBuilder {
  #errorCodeMap = {
    [httpStatusCode.BAD_REQUEST]: 1,
    [httpStatusCode.UNAUTHORIZED]: 2,
    [httpStatusCode.FORBIDDEN]: 3,
    [httpStatusCode.NOT_FOUND]: 4,
    [httpStatusCode.INTERNAL_SERVER]: 5
  };

  #response = {};

  createResponse(data) {
    this.#response = Array.isArray(data)
      ? {
          data
        }
      : data;

    return this.#response;
  }

  createErrorResponse(message, statusCode, meta = {}) {
    this.#response = {
      error: {
        code: this.#errorCodeMap[statusCode],
        message,
        details: meta
      }
    };

    return this.#response;
  }
}

export const responseBuilder = new ResponseBuilder();
