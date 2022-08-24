import joi from 'joi';
import { permissions } from '../constants';

const groupPostSchema = joi.object({
  id: joi
    .string()
    .guid({
      version: 'uuidv4'
    })
    .optional(),
  name: joi.string().min(3).max(30).required(),
  permissions: joi
    .array()
    .items(joi.string().valid(...permissions))
    .required()
});

export { groupPostSchema };
