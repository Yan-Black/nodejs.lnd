import { responseStatuses } from '../constants';

export const notFoundResponse = (id, res) => {
  res
    .status(responseStatuses.notFoundStatus)
    .send(`no group found by id: {${id}}`);
};
