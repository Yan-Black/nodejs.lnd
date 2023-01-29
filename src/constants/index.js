export const permissions = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];
export const passwordRegExp = /^[a-zA-Z0-9]{3,30}$/;

export const httpStatusCode = {
  OK: 200,
  OK_CREATED: 201,
  OK_NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  GONE: 410,
  INTERNAL_SERVER: 500
};
