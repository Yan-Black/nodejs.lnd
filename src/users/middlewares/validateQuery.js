export const validateQuery = (req, res, next) => {
  const { query } = req;
  const { loginSubstring, limit } = query;

  if (!loginSubstring || !Number(limit)) {
    res.end();
  } else {
    next();
  }
};
