import ErrorHandler, { centralizedHandler } from './CentralizedHandler';
import { responseBuilder } from '../helpers/ResponseBuilder';

export const errorHandler = (err, req, res, next) => {
  if (!ErrorHandler.isOperational(err)) {
    next(err);
  }

  centralizedHandler.handleError(err);

  const { message, statusCode, details } = centralizedHandler;

  const response = responseBuilder.createErrorResponse(
    message,
    statusCode,
    details
  );

  res.status(statusCode).json(response);
};
