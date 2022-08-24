import joi from 'joi';
import { permissions } from '../constants';

const groupPutSchema = joi.object({
  id: joi
    .string()
    .guid({
      version: 'uuidv4'
    })
    .optional(),
  name: joi.string().min(3).max(30).optional(),
  permissions: joi
    .array()
    .items(joi.string().valid(...permissions))
    .optional()
});

export { groupPutSchema };
