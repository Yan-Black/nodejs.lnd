import { getJoiErrorResponse } from '../helpers';
import { httpStatusCode } from '../constants';

export const joiValidate = (schema) => (req, res, next) => {
  const { body } = req;
  const { error } = schema.validate(body, { abortEarly: false });

  if (error?.isJoi) {
    res
      .status(httpStatusCode.BAD_REQUEST)
      .json(getJoiErrorResponse(error.details));
  } else {
    next();
  }
};
