import request from 'supertest';
import express from 'express';
import { describe, expect, it, beforeAll } from '@jest/globals';
import { groupsRouter } from '../groups';
import { loginRouter } from '../login';
import { httpStatusCode } from '../../constants';
import userGroups from '../../database/seedData/usergroups.cjs';
import seedUsers from '../../database/seedData/users.cjs';
import { expectToMatchGroupSchema } from './utils';

const [{ GroupId: testGroupId }] = userGroups;
const defaultPath = '/api/v1/groups';
const authPath = '/api/v1/login';
const app = express();
app.use(express.json());
app.use(defaultPath, groupsRouter);
app.use(authPath, loginRouter);

let authToken;

describe('Groups Service -> Test Routes', () => {
  beforeAll(async () => {
    const requestPayload = {
      userName: seedUsers[3].login,
      password: seedUsers[3].password
    };

    const loginResponse = await request(app)
      .post(authPath)
      .send(requestPayload);

    const {
      data: { token }
    } = loginResponse.body;

    authToken = token;
  });

  it('returns all groups on get request', async () => {
    const groupsResponse = await request(app)
      .get(defaultPath)
      .set('Authorization', `bearer ${authToken}`);

    expect(groupsResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(groupsResponse.statusCode).toBe(httpStatusCode.OK);
    expect(groupsResponse.body).toHaveProperty('data');

    const { data: groups } = groupsResponse.body;

    expect(groups).toBeInstanceOf(Array);
    expect(groups.length).toBeGreaterThan(0);

    groups.forEach(expectToMatchGroupSchema);
  });

  it('returns single group data object by matching groupId on get request', async () => {
    const groupResponse = await request(app)
      .get(`${defaultPath}/${testGroupId}`)
      .set('Authorization', `bearer ${authToken}`);

    expect(groupResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(groupResponse.statusCode).toBe(httpStatusCode.OK);
    expect(groupResponse.body).toHaveProperty('data');

    const { data: group } = groupResponse.body;

    expectToMatchGroupSchema(group);
  });

  it('returns group data object on post request', async () => {
    const testGroup = {
      name: 'testPost',
      permissions: ['READ']
    };

    const createdGroupResponse = await request(app)
      .post(defaultPath)
      .send(testGroup)
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${authToken}`);

    expect(createdGroupResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(createdGroupResponse.statusCode).toBe(httpStatusCode.OK_CREATED);
    expect(createdGroupResponse.body).toHaveProperty('data');

    const { data: group } = createdGroupResponse.body;

    expectToMatchGroupSchema(group);
  });

  it('returns group data object on post request', async () => {
    const testGroup = {
      name: 'TOP-ADMINS'
    };

    const updatedGroupResponse = await request(app)
      .put(`${defaultPath}/${testGroupId}`)
      .send(testGroup)
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${authToken}`);

    expect(updatedGroupResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(updatedGroupResponse.statusCode).toBe(httpStatusCode.OK);
    expect(updatedGroupResponse.body).toHaveProperty('data');

    const { data: group } = updatedGroupResponse.body;

    expectToMatchGroupSchema(group);

    expect(group.name).toEqual(testGroup.name);
  });

  it('returns 204 status code on delete request', async () => {
    const testGroup = {
      name: 'testDelete',
      permissions: ['READ']
    };

    const createdGroupResponse = await request(app)
      .post(defaultPath)
      .send(testGroup)
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${authToken}`);

    const {
      data: { id }
    } = createdGroupResponse.body;

    const res = await request(app)
      .delete(`${defaultPath}/${id}`)
      .set('Authorization', `bearer ${authToken}`);

    expect(res.statusCode).toBe(httpStatusCode.OK_NO_CONTENT);
  });
});
