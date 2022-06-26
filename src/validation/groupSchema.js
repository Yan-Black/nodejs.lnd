import joi from 'joi';

const permissions = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

const groupSchema = joi.object({
  id: joi.string().optional(),
  name: joi.string().min(3).max(30).required(),
  permissions: joi
    .array()
    .items(joi.string().valid(...permissions))
    .required()
});

export { groupSchema };
