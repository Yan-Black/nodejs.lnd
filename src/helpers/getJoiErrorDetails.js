export const getJoiErrorDetails = (errorDetails = []) => {
  const errors = errorDetails.map(({ path: [key], message }) => ({
    key,
    message
  }));

  return {
    errors
  };
};
