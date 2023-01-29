const users = require('./users.cjs');
const groups = require('./groups.cjs');

const [adminsGroupId, readersGroupId] = groups.map(({ id }) => id);

module.exports = users.map(({ id: UserId }, index) => ({
  UserId,
  GroupId: index <= 1 ? adminsGroupId : readersGroupId
}));
