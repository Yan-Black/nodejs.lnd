import request from 'supertest';
import express from 'express';
import { describe, expect, it, afterEach } from '@jest/globals';
import { series } from 'async';
import { exec } from 'child_process';
import { groupsRouter } from '../groups';
import testGroups from '../../database/seedData/groups.cjs';
import testUsers from '../../database/seedData/users.cjs';

const [adminsTestGroupId, readersTestGroupId] = testGroups.map(({ id }) => id);
const [{ id: testUserId }] = testUsers;
const defaultPath = '/api/v1/groups';

const app = express();
app.use(express.json());
app.use(defaultPath, groupsRouter);

const expectToMatchUserSchema = (user) => {
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('login');
  expect(user).toHaveProperty('password');
  expect(user).toHaveProperty('age');
};

describe('Groups Service -> Test Association Routes', () => {
  afterEach(() => {
    series([
      // () => exec('set NODE_ENV=test&&npm run db:seed:undo:all'),
      () => exec('set NODE_ENV=test&&npm run db:seed:all')
    ]);
  });

  it('returns all associated with group users on get request', async () => {
    const response = await request(app)
      .get(`${defaultPath}/${adminsTestGroupId}/users`)
      .set('Accept', 'application/json');

    expect(response.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.statusCode).toBe(200);

    const { data: users } = response.body;
    expect(users.length).toBeGreaterThan(0);

    const [user] = users;
    expectToMatchUserSchema(user);
  });

  it('returns user data object by matching id on get request', async () => {
    const response = await request(app)
      .get(`${defaultPath}/${adminsTestGroupId}/users/${testUserId}`)
      .set('Accept', 'application/json');

    expect(response.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.statusCode).toBe(200);

    const { data: user } = response.body;
    expectToMatchUserSchema(user);
  });

  // it('returns user data object on put request with userId paramether, no body passed', async () => {
  //   const response = await request(app)
  //     .put(`${defaultPath}/${readersTestGroupId}/users/${testUserId}`)
  //     .set('Accept', 'application/json');

  //   expect(response.header['content-type']).toBe(
  //     'application/json; charset=utf-8'
  //   );
  //   expect(response.statusCode).toBe(200);

  //   const { data: user } = response.body;
  //   expectToMatchUserSchema(user);
  // });

  it('returns array of user data objects on put request with body contain userIds list', async () => {
    const requestPayload = {
      userIds: [testUserId]
    };

    const response = await request(app)
      .put(`${defaultPath}/${readersTestGroupId}/users`)
      .send(requestPayload)
      .set('Accept', 'application/json');

    expect(response.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.statusCode).toBe(200);

    const { data: users } = response.body;
    expect(users.length).toBeGreaterThan(0);

    const [user] = users;
    expectToMatchUserSchema(user);
  });

  it(`returns 204 status code on delete request with userId param,
  specified user should be detached from a particular group`, async () => {
    const response = await request(app).delete(
      `${defaultPath}/${adminsTestGroupId}/users/${testUserId}`
    );

    expect(response.statusCode).toBe(204);

    const {
      body: { data: users }
    } = await request(app).get(`${defaultPath}/${adminsTestGroupId}/users`);

    expect(users.find(({ id }) => id === testUserId)).toBeUndefined();
  });

  it(`returns 204 status code on delete request without params, 
  all users tied to a particullar group should be detached from it`, async () => {
    const response = await request(app).delete(
      `${defaultPath}/${adminsTestGroupId}/users`
    );

    expect(response.statusCode).toBe(204);

    const {
      body: { data: users }
    } = await request(app).get(`${defaultPath}/${adminsTestGroupId}/users`);
    expect(users.length).toEqual(0);
  });
});
