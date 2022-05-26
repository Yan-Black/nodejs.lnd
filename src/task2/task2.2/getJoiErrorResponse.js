export const getJoiErrorResponse = (errorDetails = []) => {
  const errors = errorDetails.map(({ path: [key], message }) => ({
    key,
    message,
  }));

  return {
    status: 'failed',
    errors,
  };
};
