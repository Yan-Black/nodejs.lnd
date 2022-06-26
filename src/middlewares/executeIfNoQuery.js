export const executeIfNoQuery = (func) => (req, res, next) => {
  const { query } = req;

  if (!Object.getOwnPropertyNames(query).length) {
    func(req, res);
    return;
  }

  next();
};
