import { centralizedHandler } from './CentralizedHandler';
import { responseBuilder } from '../helpers/ResponseBuilder';

export const errorHandler = (err, req, res, next) => {
  if (!centralizedHandler.isOperational(err)) {
    next(err);
  }

  centralizedHandler.handleError(err);

  const response = responseBuilder.createErrorResponse(
    centralizedHandler.responseMessage,
    centralizedHandler.statusCode
  );

  res.status(centralizedHandler.statusCode).json(response);
};
