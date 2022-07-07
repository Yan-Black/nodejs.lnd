module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Groups',
      [
        {
          id: '8fc2e221-a40b-4958-b577-82708c00282f',
          name: 'Admins',
          permission: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']
        },
        {
          id: 'e671dc02-f046-40ac-a5af-2fe501775c87',
          name: 'Readers',
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
