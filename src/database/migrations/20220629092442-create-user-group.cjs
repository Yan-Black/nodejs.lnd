module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserGroups', {
      userId: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      groupId: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: 'Groups',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('UserGroups');
  }
};
