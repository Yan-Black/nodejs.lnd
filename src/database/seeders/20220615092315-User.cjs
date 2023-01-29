const users = require('../seedData/users.cjs');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
