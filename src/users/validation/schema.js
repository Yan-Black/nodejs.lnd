import joi from 'joi';
import { passwordRegExp } from '../constants';

const schema = joi.object({
  id: joi.string().optional(),
  login: joi.string().min(3).max(30).required(),
  password: joi.string().pattern(passwordRegExp).required(),
  age: joi.number().min(4).max(130).required(),
  isDeleted: joi.boolean().required()
});

export { schema };
