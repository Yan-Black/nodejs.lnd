import request from 'supertest';
import express from 'express';
import { describe, expect, it } from '@jest/globals';
import { usersRouter } from '../users';
import { httpStatusCode } from '../../constants';
import userGroups from '../../database/seedData/usergroups.cjs';
import { expectToMatchUserSchema } from './utils';

const [{ UserId: testUserId1 }] = userGroups;
const defaultPath = '/api/v1/users';
const app = express();
app.use(express.json());
app.use(defaultPath, usersRouter);

describe('Users Service -> Test Routes', () => {
  it('returns all users on get request', async () => {
    const usersResponse = await request(app).get(defaultPath);

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
    const usersResponse = await request(app).get(
      `${defaultPath}?loginSubstring=an&limit=4`
    );

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
    const userResponse = await request(app).get(
      `${defaultPath}/${testUserId1}`
    );

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
      .set('Accept', 'application/json');

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
      .set('Accept', 'application/json');

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
      .set('Accept', 'application/json');

    const {
      data: { id }
    } = createdUserResponse.body;

    const res = await request(app).delete(`${defaultPath}/${id}`);

    expect(res.statusCode).toBe(httpStatusCode.OK_NO_CONTENT);
  });
});
