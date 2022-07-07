module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'UserGroups',
      [
        {
          userId: 'b39162ea-f7e3-42b1-834b-d2882b86865e',
          groupId: '8fc2e221-a40b-4958-b577-82708c00282f'
        },
        {
          userId: '9a94ef64-139c-4bf5-992b-f0240cb3665f',
          groupId: '8fc2e221-a40b-4958-b577-82708c00282f'
        },
        {
          userId: '16571e21-4831-46bf-a53b-1a808c3c55fe',
          groupId: '8fc2e221-a40b-4958-b577-82708c00282f'
        },
        {
          userId: 'c75c0d09-210d-4ea5-bc57-53871d261263',
          groupId: 'e671dc02-f046-40ac-a5af-2fe501775c87'
        },
        {
          userId: 'addd0142-702c-4379-b2b1-e8b407d6ad59',
          groupId: 'e671dc02-f046-40ac-a5af-2fe501775c87'
        }
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('UserGroups', null, {});
  }
};
