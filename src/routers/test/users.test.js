import request from 'supertest';
import express from 'express';
import { describe, expect, it } from '@jest/globals';
import { usersRouter } from '../users';

const defaultPath = '/api/v1/users';
const app = express();
app.use(express.json());
app.use(defaultPath, usersRouter);

describe('Users Service -> Test Routes', () => {
  it('returns all users on get request', async () => {
    const res = await request(app).get(defaultPath);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('returns users collection based on query parameters {loginSubstring} and {limit}', async () => {
    const res = await request(app).get(
      `${defaultPath}?loginSubstring=an&limit=4`
    );

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('returns single object by matching id on get request', async () => {
    const { body } = await request(app).get(defaultPath);
    const [{ id }] = body.data;

    const res = await request(app).get(`${defaultPath}/${id}`);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(body.data[0]);
  });

  it('returns newly created object in users collection on post request', async () => {
    const mockUser = {
      login: 'Mark',
      password: 'abcdABCD1234',
      age: 30
    };

    const res = await request(app)
      .post(defaultPath)
      .send(mockUser)
      .set('Accept', 'application/json');

    const { body } = res;
    const { login, password, age } = body;

    const toVerify = {
      login,
      password,
      age
    };

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(body).toHaveProperty('id');
    expect(toVerify).toMatchObject(mockUser);
  });

  it('returns user on put request', async () => {
    const { body } = await request(app).get(defaultPath);
    const [{ id }] = body.data;

    const mockUser = {
      id,
      login: 'Mark',
      password: 'abcdABCD1234',
      age: 30
    };

    const res = await request(app)
      .put(`${defaultPath}/${id}`)
      .send(mockUser)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(mockUser);
  });

  it('returns 204 status code on delete request', async () => {
    const { body } = await request(app).get(defaultPath);
    const [{ id }] = body.data;

    const res = await request(app).delete(`${defaultPath}/${id}`);

    expect(res.statusCode).toBe(204);
  });
});
