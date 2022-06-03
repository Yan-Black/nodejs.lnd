import { schema } from '../validation/schema';
import { getJoiErrorResponse } from '../helpers';
import { responseStatuses } from '../constants';

export const userBodyJoiValidate = (req, res, next) => {
  const { body } = req;
  const { error } = schema.validate(body);

  if (error?.isJoi) {
    res
      .status(responseStatuses.clientErrorStatus)
      .json(getJoiErrorResponse(error.details));
  } else {
    next();
  }
};
