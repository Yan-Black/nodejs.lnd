import joi from 'joi';
import { passwordRegExp } from '../constants';

const userPostSchema = joi.object({
  id: joi
    .string()
    .guid({
      version: 'uuidv4'
    })
    .optional(),
  login: joi.string().min(3).max(30).required(),
  password: joi.string().pattern(passwordRegExp).required(),
  age: joi.number().min(4).max(130).required()
});

export { userPostSchema };
