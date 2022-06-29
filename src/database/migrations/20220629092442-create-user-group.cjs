module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserGroups', {
      userId: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      groupId: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: 'Groups',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('UserGroups');
  }
};
