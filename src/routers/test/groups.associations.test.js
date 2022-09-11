import request from 'supertest';
import express from 'express';
import { describe, expect, it } from '@jest/globals';
import { usersRouter } from '../users';
import { groupsRouter } from '../groups';
import userGroups from '../../database/seedData/usergroups.cjs';
import { expectToMatchGroupSchema, expectToMatchUserSchema } from './utils';
import { httpStatusCode } from '../../constants';

const [
  { UserId: testUserId1, GroupId: testGroupId1 },
  { UserId: testUserId2 }
] = userGroups;
const defaultPath = '/api/v1/groups';
const usersPath = '/api/v1/users';

const app = express();
app.use(express.json());
app.use(defaultPath, groupsRouter);
app.use(usersPath, usersRouter);

describe('Groups Service -> Test Association Routes', () => {
  it('returns all associated users with a group on get request', async () => {
    const groupUsersResponse = await request(app)
      .get(`${defaultPath}/${testGroupId1}/users`)
      .set('Accept', 'application/json');

    expect(groupUsersResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(groupUsersResponse.statusCode).toBe(httpStatusCode.OK);

    const { data: users } = groupUsersResponse.body;

    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);

    users.forEach(expectToMatchUserSchema);
  });
  it('returns associated with a group user data object by matching userId on get request', async () => {
    const groupUserResponse = await request(app)
      .get(`${defaultPath}/${testGroupId1}/users/${testUserId1}`)
      .set('Accept', 'application/json');

    expect(groupUserResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(groupUserResponse.statusCode).toBe(httpStatusCode.OK);

    const { data: user } = groupUserResponse.body;

    expectToMatchUserSchema(user);
  });
  it(`returns group data object with a associated users list on put request with userId paramether,
      user must be added, no request body passed`, async () => {
    const testUser = {
      login: 'testPutWithGroupIdParam',
      password: '12345ASDFGQWRER',
      age: 20
    };

    const createdUserResponse = await request(app)
      .post(usersPath)
      .send(testUser);

    const {
      data: { id: testUserId }
    } = createdUserResponse.body;

    const groupWithAddedUserResponse = await request(app)
      .put(`${defaultPath}/${testGroupId1}/users/${testUserId}`)
      .set('Accept', 'application/json');

    expect(groupWithAddedUserResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(groupWithAddedUserResponse.statusCode).toBe(httpStatusCode.OK);

    const { data: group } = groupWithAddedUserResponse.body;

    expectToMatchGroupSchema(group);

    const { users } = group;

    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);

    users.forEach(expectToMatchUserSchema);

    expect(users.find(({ id }) => id === testUserId)).toBeDefined();
  });
  it(`returns group data object with a associated users list on put reques,
      request body contain userIds list,
      users must be added
      no url parameter passed`, async () => {
    const testUsers = [
      {
        login: 'testPutWithNoUserIdParam1',
        password: '12345ASPOJEMFUR',
        age: 20
      },
      {
        login: 'testPutWithNoUserIdParam2',
        password: '12345ASFHGNJEOP',
        age: 22
      }
    ];

    const testUserIds = [];

    await Promise.all(
      testUsers.map(async (userDTO) => {
        const createdUserResponse = await request(app)
          .post(usersPath)
          .send(userDTO);
        const {
          data: { id: putTestUserId }
        } = createdUserResponse.body;
        testUserIds.push(putTestUserId);
      })
    );

    const requestPayload = {
      userIds: testUserIds
    };

    const groupWithAddedUsersResponse = await request(app)
      .put(`${defaultPath}/${testGroupId1}/users`)
      .send(requestPayload)
      .set('Accept', 'application/json');

    expect(groupWithAddedUsersResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(groupWithAddedUsersResponse.statusCode).toBe(httpStatusCode.OK);

    const { data: group } = groupWithAddedUsersResponse.body;

    expectToMatchGroupSchema(group);

    const { users } = group;

    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);

    users.forEach(expectToMatchUserSchema);

    testUserIds.forEach((id) => {
      expect(users.find(({ id: userId }) => userId === id)).toBeDefined();
    });
  });
  it(`returns 204 status code on delete request with userId param,
      specified user should be detached from a particular group`, async () => {
    const testGroup = {
      name: 'testDeleteWithUserIdParam',
      permissions: ['READ']
    };

    const createdGroupResponse = await request(app)
      .post(defaultPath)
      .send(testGroup);

    const {
      data: { id: testGroupId }
    } = createdGroupResponse.body;

    await request(app)
      .put(`${defaultPath}/${testGroupId}/users/${testUserId1}`)
      .set('Accept', 'application/json');

    const deleteAssociatedUserResponse = await request(app).delete(
      `${defaultPath}/${testGroupId}/users/${testUserId1}`
    );

    expect(deleteAssociatedUserResponse.statusCode).toBe(
      httpStatusCode.OK_NO_CONTENT
    );

    const {
      body: { data: users }
    } = await request(app).get(`${defaultPath}/${testGroupId}/users`);

    expect(users.find(({ id }) => id === testUserId1)).toBeUndefined();
  });
  it(`returns 204 status code on delete request without params,
  all users tied to a particullar group should be detached from it`, async () => {
    const testGroup = {
      name: 'testDeleteWithoutUserIdParam',
      permissions: ['READ']
    };

    const createdGroupResponse = await request(app)
      .post(defaultPath)
      .send(testGroup);

    const {
      data: { id: testGroupId }
    } = createdGroupResponse.body;

    const requestPayload = {
      userIds: [testUserId1, testUserId2]
    };

    await request(app)
      .put(`${defaultPath}/${testGroupId}/users/${testUserId1}`)
      .send(requestPayload)
      .set('Accept', 'application/json');

    const deleteAssociatedUsersResponse = await request(app).delete(
      `${defaultPath}/${testGroupId}/users`
    );

    expect(deleteAssociatedUsersResponse.statusCode).toBe(
      httpStatusCode.OK_NO_CONTENT
    );

    const {
      body: { data: users }
    } = await request(app).get(`${defaultPath}/${testGroupId}/users`);

    expect(users.length).toEqual(0);
  });
});
