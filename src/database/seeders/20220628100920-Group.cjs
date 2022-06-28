module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Groups',
      [
        {
          id: 'b39162ea-f7e3-42b1-834b-d2882b86865e',
          name: 'Authors',
          permission: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']
        },
        {
          id: 'b39162ea-f7e3-42b1-834b-d2882b86865e',
          name: 'Users',
          permission: ['READ', 'SHARE']
        }
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
