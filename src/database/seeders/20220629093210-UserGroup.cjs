const userGroups = require('../seedData/usergroups.cjs');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('UserGroups', userGroups, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('UserGroups', null, {});
  }
};
