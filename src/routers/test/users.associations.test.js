import request from 'supertest';
import express from 'express';
import { describe, expect, it } from '@jest/globals';
import { usersRouter } from '../users';
import { groupsRouter } from '../groups';
import userGroups from '../../database/seedData/usergroups.cjs';
import { expectToMatchGroupSchema, expectToMatchUserSchema } from './utils';
import { httpStatusCode } from '../../constants';

const [{ UserId: testUserId1, GroupId: testGroupId1 }] = userGroups;
const [{ GroupId: testGroupId2 }] = userGroups.reverse();
const defaultPath = '/api/v1/users';
const groupsPath = '/api/v1/groups';

const app = express();
app.use(express.json());
app.use(defaultPath, usersRouter);
app.use(groupsPath, groupsRouter);

describe('Users Service -> Test Association Routes', () => {
  it('returns all associated groups with a user on get request', async () => {
    const userGroupsResponse = await request(app)
      .get(`${defaultPath}/${testUserId1}/groups`)
      .set('Accept', 'application/json');

    expect(userGroupsResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(userGroupsResponse.statusCode).toBe(httpStatusCode.OK);

    const { data: groups } = userGroupsResponse.body;

    expect(groups).toBeInstanceOf(Array);
    expect(groups.length).toBeGreaterThan(0);

    groups.forEach(expectToMatchGroupSchema);
  });

  it('returns associated with a user group data object by matching groupId on get request', async () => {
    const userGroupResponse = await request(app)
      .get(`${defaultPath}/${testUserId1}/groups/${testGroupId1}`)
      .set('Accept', 'application/json');

    expect(userGroupResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(userGroupResponse.statusCode).toBe(httpStatusCode.OK);

    const { data: group } = userGroupResponse.body;
    expectToMatchGroupSchema(group);
  });

  it(`returns user data object with a list of associated groups on put request with groupId paramether,
      no request body passed, group must be added to a user`, async () => {
    const testGroup = {
      name: 'testPutWithGroupIdParam',
      permissions: ['READ']
    };

    const createdGroupResponse = await request(app)
      .post(groupsPath)
      .send(testGroup);

    const {
      data: { id: testGroupId }
    } = createdGroupResponse.body;

    const userWithAddedGroupResponse = await request(app)
      .put(`${defaultPath}/${testUserId1}/groups/${testGroupId}`)
      .set('Accept', 'application/json');

    expect(userWithAddedGroupResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(userWithAddedGroupResponse.statusCode).toBe(httpStatusCode.OK);

    const { data: user } = userWithAddedGroupResponse.body;

    expectToMatchUserSchema(user);

    const { groups } = user;

    expect(groups).toBeInstanceOf(Array);
    expect(groups.length).toBeGreaterThan(0);

    groups.forEach(expectToMatchGroupSchema);

    expect(groups.find(({ id }) => id === testGroupId)).toBeDefined();
  });

  it(`returns user data object with a list of associated groups on put request,
      request body contain groupIds list,
      groups must be added
      no groupId parameter passed`, async () => {
    const testGroups = [
      {
        name: 'testPutWithNoGroupIdParam1',
        permissions: ['READ']
      },
      {
        name: 'testPutWithNoGroupIdParam2',
        permissions: ['WRITE']
      }
    ];

    const testGroupIds = [];

    await Promise.all(
      testGroups.map(async (groupDTO) => {
        const createdGroupResponse = await request(app)
          .post(groupsPath)
          .send(groupDTO);

        const {
          data: { id: putTestGroupId }
        } = createdGroupResponse.body;

        testGroupIds.push(putTestGroupId);
      })
    );

    const requestPayload = {
      groupIds: testGroupIds
    };

    const userWithAddedGroupsResponse = await request(app)
      .put(`${defaultPath}/${testUserId1}/groups`)
      .send(requestPayload)
      .set('Accept', 'application/json');

    expect(userWithAddedGroupsResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(userWithAddedGroupsResponse.statusCode).toBe(httpStatusCode.OK);

    const { data: user } = userWithAddedGroupsResponse.body;
    expectToMatchUserSchema(user);

    const { groups } = user;

    expect(groups).toBeInstanceOf(Array);
    expect(groups.length).toBeGreaterThan(0);

    groups.forEach(expectToMatchGroupSchema);

    testGroupIds.forEach((id) => {
      expect(groups.find(({ id: groupId }) => groupId === id)).toBeDefined();
    });
  });

  it(`returns 204 status code on delete request with groupId param,
      specified group should be detached from a particular user`, async () => {
    const testUser = {
      login: 'testDeleteWithGroupIdParam',
      password: '12345ASDFGQWRER',
      age: 20
    };

    const createdUserResponse = await request(app)
      .post(defaultPath)
      .send(testUser);

    const {
      data: { id: testUserId }
    } = createdUserResponse.body;

    await request(app)
      .put(`${defaultPath}/${testUserId}/groups/${testGroupId1}`)
      .set('Accept', 'application/json');

    const deleteAssociatedGroupResponse = await request(app).delete(
      `${defaultPath}/${testUserId}/groups/${testGroupId1}`
    );

    expect(deleteAssociatedGroupResponse.statusCode).toBe(
      httpStatusCode.OK_NO_CONTENT
    );

    const associatedGroupsResponse = await request(app).get(
      `${defaultPath}/${testUserId}/groups`
    );

    const {
      body: { data: groups }
    } = associatedGroupsResponse;

    expect(groups.find(({ id }) => id === testGroupId1)).toBeUndefined();
  });

  it(`returns 204 status code on delete request without params,
      all groups tied to a particullar user should be detached from it`, async () => {
    const testUser = {
      login: 'testDeleteWithoutGroupIdParam',
      password: '12345ASDFGQWRER',
      age: 20
    };

    const createdUserResponse = await request(app)
      .post(defaultPath)
      .send(testUser);

    const {
      data: { id: testUserId }
    } = createdUserResponse.body;

    const requestPayload = {
      groupIds: [testGroupId1, testGroupId2]
    };

    await request(app)
      .put(`${defaultPath}/${testUserId}/groups`)
      .send(requestPayload)
      .set('Accept', 'application/json');

    const deleteAssociatedGroupsResponse = await request(app).delete(
      `${defaultPath}/${testUserId}/groups`
    );

    expect(deleteAssociatedGroupsResponse.statusCode).toBe(
      httpStatusCode.OK_NO_CONTENT
    );

    const associatedGroupsResponse = await request(app).get(
      `${defaultPath}/${testUserId}/groups`
    );

    const {
      body: { data: groups }
    } = associatedGroupsResponse;

    expect(groups.length).toEqual(0);
  });
});
