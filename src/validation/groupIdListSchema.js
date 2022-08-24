import joi from 'joi';

const groupIdListSchema = joi.object({
  groupIds: joi
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

export { groupIdListSchema };
