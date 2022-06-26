const seedData = require('../seedData/index.cjs');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', seedData, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
