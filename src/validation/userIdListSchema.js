import joi from 'joi';

const userIdListSchema = joi.object({
  userIds: joi
    .array()
    .items(
      joi
        .string()
        .guid({
          version: 'uuidv4'
        })
        .required()
    )
    .required()
});

export { userIdListSchema };
