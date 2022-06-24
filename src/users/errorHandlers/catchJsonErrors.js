import { responseStatuses } from '../constants';

export const catchJsonErrors = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(responseStatuses.clientErrorStatus).send({
      status: responseStatuses.clientErrorStatus,
      message: err.message
    });
  } else {
    next(err);
  }
};
