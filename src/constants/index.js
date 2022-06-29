export const permissions = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];
export const passwordRegExp = /^[a-zA-Z0-9]{3,30}$/;
export const responseStatuses = {
  successStatus: 200,
  successStatusNoResp: 204,
  clientErrorStatus: 400,
  notFoundStatus: 404,
  serverErrorStatus: 500
};
