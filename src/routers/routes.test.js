import request from 'supertest';
import express from 'express';
import { describe, expect, it } from '@jest/globals';
import { router } from './users';

const defaultPath = '/api/users';
const app = express();
app.use(express.json());
app.use(defaultPath, router);

describe('Users Service -> Test Routes', () => {
  it('returns mock users on get request without query /', async () => {
    const res = await request(app).get(defaultPath);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns users collection based on query parameters {loginSubstring} and {limit}', async () => {
    const res = await request(app).get(
      `${defaultPath}?loginSubstring=an&limit=4`
    );

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.length).toBeLessThanOrEqual(4);
  });

  it('returns single object by matching id on get request', async () => {
    const { body } = await request(app).get(defaultPath);
    const [{ id }] = body;

    const res = await request(app).get(`${defaultPath}/${id}`);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(body[0]);
  });

  it('returns id of newly created object in users collection on post request', async () => {
    const res = await request(app)
      .post(defaultPath)
      .send({
        login: 'Mark',
        password: 'abcdABCD1234',
        age: 30
      })
      .set('Accept', 'application/json');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
  });

  it('returns message User was updated successfully on put request', async () => {
    const { body } = await request(app).get(defaultPath);
    const [{ id }] = body;

    const res = await request(app)
      .put(`${defaultPath}/${id}`)
      .send({
        login: 'Mark',
        password: 'abcdABCD1234',
        age: 30
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual('User was updated successfully.');
  });

  it('returns message User was deleted successfully on delete request', async () => {
    const { body } = await request(app).get(defaultPath);
    const [{ id }] = body;

    const res = await request(app).delete(`${defaultPath}/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual('User was deleted successfully!');
  });
});
