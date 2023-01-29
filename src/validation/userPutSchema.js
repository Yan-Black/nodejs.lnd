import joi from 'joi';
import { passwordRegExp } from '../constants';

const userPutSchema = joi.object({
  id: joi
    .string()
    .guid({
      version: 'uuidv4'
    })
    .optional(),
  login: joi.string().min(3).max(30).optional(),
  password: joi.string().pattern(passwordRegExp).optional(),
  age: joi.number().min(4).max(130).optional()
});

export { userPutSchema };
