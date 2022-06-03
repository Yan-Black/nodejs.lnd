import { responseStatuses } from '../constants';

export const validateQuery = (req, res, next) => {
  const { query } = req;
  const { loginSubstring, limit } = query;

  if (!loginSubstring || !Number(limit)) {
    res.status(responseStatuses.clientErrorStatus).end();
  } else {
    next();
  }
};
