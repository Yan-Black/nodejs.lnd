export const logErrors = (err, req, res, next) => {
  global.console.error(err.stack);
  next(err);
};
