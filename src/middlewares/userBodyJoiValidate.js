import { getJoiErrorResponse } from '../helpers';
import { responseStatuses } from '../constants';

export const joiValidate = (schema) => (req, res, next) => {
  const { body } = req;
  const { error } = schema.validate(body, { abortEarly: false });

  if (error?.isJoi) {
    res
      .status(responseStatuses.clientErrorStatus)
      .json(getJoiErrorResponse(error.details));
  } else {
    next();
  }
};
