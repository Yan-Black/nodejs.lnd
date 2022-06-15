const initialData = require('./initialUsers.cjs');

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Users', initialData);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Users', initialData, {});
  }
};
