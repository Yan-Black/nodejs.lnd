import joi from 'joi';
import { permissions } from '../constants';

const groupSchema = joi.object({
  id: joi.string().optional(),
  name: joi.string().min(3).max(30).required(),
  permissions: joi
    .array()
    .items(joi.string().valid(...permissions))
    .required()
});

export { groupSchema };
