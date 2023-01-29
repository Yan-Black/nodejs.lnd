import { getJoiErrorDetails } from '../helpers';
import HTTP400Error from '../errorHandler/HTTP400Error';

export const joiValidate = (schema) => (req, res, next) => {
  const { body } = req;
  const { error } = schema.validate(body, { abortEarly: false });

  if (error?.isJoi) {
    const errorDetails = getJoiErrorDetails(error.details);
    throw new HTTP400Error('invalid request body', errorDetails);
  } else {
    next();
  }
};
