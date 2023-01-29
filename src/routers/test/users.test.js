import request from 'supertest';
import express from 'express';
import { describe, expect, it, beforeAll } from '@jest/globals';
import { usersRouter } from '../users';
import { loginRouter } from '../login';
import { httpStatusCode } from '../../constants';
import userGroups from '../../database/seedData/usergroups.cjs';
import seedUsers from '../../database/seedData/users.cjs';
import { expectToMatchUserSchema } from './utils';

const [{ UserId: testUserId1 }] = userGroups;
const defaultPath = '/api/v1/users';
const authPath = '/api/v1/login';
const app = express();
app.use(express.json());
app.use(defaultPath, usersRouter);
app.use(authPath, loginRouter);

let authToken;

describe('Users Service -> Test Routes', () => {
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

  it('returns all users on get request', async () => {
    const usersResponse = await request(app)
      .get(defaultPath)
      .set('Authorization', `bearer ${authToken}`);

    expect(usersResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(usersResponse.statusCode).toBe(httpStatusCode.OK);
    expect(usersResponse.body).toHaveProperty('data');

    const { data: users } = usersResponse.body;

    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);

    users.forEach(expectToMatchUserSchema);
  });

  it('returns users collection based on query parameters {loginSubstring} and {limit}', async () => {
    const usersResponse = await request(app)
      .get(`${defaultPath}?loginSubstring=an&limit=4`)
      .set('Authorization', `bearer ${authToken}`);

    expect(usersResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(usersResponse.statusCode).toBe(httpStatusCode.OK);
    expect(usersResponse.body).toHaveProperty('data');

    const { data: users } = usersResponse.body;

    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);

    users.forEach(expectToMatchUserSchema);
  });

  it('returns user data object by matching userId on get request', async () => {
    const userResponse = await request(app)
      .get(`${defaultPath}/${testUserId1}`)
      .set('Authorization', `bearer ${authToken}`);

    expect(userResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(userResponse.statusCode).toBe(httpStatusCode.OK);
    expect(userResponse.body).toHaveProperty('data');

    const { data: user } = userResponse.body;

    expectToMatchUserSchema(user);
  });

  it('returns user data object on post request', async () => {
    const testUser = {
      login: 'testPost',
      password: 'abcdABCD1234',
      age: 30
    };

    const createdUserResponse = await request(app)
      .post(defaultPath)
      .send(testUser)
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${authToken}`);

    expect(createdUserResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(createdUserResponse.statusCode).toBe(httpStatusCode.OK_CREATED);
    expect(createdUserResponse.body).toHaveProperty('data');

    const { data: user } = createdUserResponse.body;

    expectToMatchUserSchema(user);
  });

  it('returns user data object on put request', async () => {
    const testUser = {
      login: 'testPut'
    };

    const updatedUserResponse = await request(app)
      .put(`${defaultPath}/${testUserId1}`)
      .send(testUser)
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${authToken}`);

    expect(updatedUserResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(updatedUserResponse.statusCode).toBe(httpStatusCode.OK);
    expect(updatedUserResponse.body).toHaveProperty('data');

    const { data: user } = updatedUserResponse.body;

    expectToMatchUserSchema(user);

    expect(user.login).toEqual(testUser.login);
  });

  it('returns 204 status code on delete request', async () => {
    const testUser = {
      login: 'testDelete',
      password: 'abcdABCD1234',
      age: 30
    };

    const createdUserResponse = await request(app)
      .post(defaultPath)
      .send(testUser)
      .set('Accept', 'application/json')
      .set('Authorization', `bearer ${authToken}`);

    const {
      data: { id }
    } = createdUserResponse.body;

    const res = await request(app)
      .delete(`${defaultPath}/${id}`)
      .set('Authorization', `bearer ${authToken}`);

    expect(res.statusCode).toBe(httpStatusCode.OK_NO_CONTENT);
  });
});
