const groups = require('../seedData/groups.cjs');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Groups', groups, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
