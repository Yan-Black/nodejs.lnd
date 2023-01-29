import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { describe, expect, it } from '@jest/globals';
import { loginRouter } from '../login';
import { httpStatusCode } from '../../constants';
import users from '../../database/seedData/users.cjs';

const [{ login, password }] = users.reverse();
const defaultPath = '/api/v1/login';
const app = express();
app.use(express.json());
app.use(defaultPath, loginRouter);

const { JWT_SECRET } = process.env;

describe('Login Service -> Test Authentication', () => {
  it('returns auth token on get request', async () => {
    const requestPayload = {
      userName: login,
      password
    };

    const loginResponse = await request(app)
      .post(defaultPath)
      .send(requestPayload)
      .set('Accept', 'application/json');

    expect(loginResponse.header['content-type']).toBe(
      'application/json; charset=utf-8'
    );

    expect(loginResponse.statusCode).toBe(httpStatusCode.OK);

    const {
      data: { token }
    } = loginResponse.body;

    const isValid = jwt.verify(token, JWT_SECRET, (err) => !err);

    expect(isValid).toEqual(true);
  });
});
