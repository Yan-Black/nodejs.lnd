import { schema } from './schema';
import { getJoiErrorResponse } from './getJoiErrorResponse';

export const userBodyValidationMiddleware = (req, res, next) => {
  const { body } = req;
  const { error } = schema.validate(body);

  if (error.isJoi) {
    res.status(400).json(getJoiErrorResponse(error.details));
  } else {
    next();
  }
};
