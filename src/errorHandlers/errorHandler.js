import { responseStatuses } from '../constants';

export const errorHandler = (err, req, res, next) => {
  global.console.error(err.stack);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(responseStatuses.clientErrorStatus).send({
      status: responseStatuses.clientErrorStatus,
      message: err.message
    });
  } else {
    res.status(responseStatuses.serverErrorStatus).send({ message: 'error' });
    next();
  }
};
