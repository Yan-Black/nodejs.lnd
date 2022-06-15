import request from 'supertest';
import express from 'express';
import { describe, expect, it } from '@jest/globals';
import mockData from '../model/mockData';
import { router } from '.';

const defaultPath = '/api/users';
const app = express();
app.use(express.json());
app.use(defaultPath, router);

describe('Users Service -> Test Routes', () => {
  it('returns mock users on get request without query /', async () => {
    const res = await request(app).get(defaultPath);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(mockData);
  });

  it('returns users collection based on query parameters {loginSubstring} and {limit}', async () => {
    const res = await request(app).get(
      `${defaultPath}?loginSubstring=an&limit=4`
    );
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(4);
  });

  it('returns single object by matching id on get request', async () => {
    const res = await request(app).get(`${defaultPath}/${mockData[0].id}`);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(mockData[0]);
  });

  it('returns id of newly created object in users collection on post request', async () => {
    const res = await request(app)
      .post(defaultPath)
      .send({
        login: 'Mark',
        password: 'abcdABCD1234',
        age: 30,
        isDeleted: false
      })
      .set('Accept', 'application/json');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
  });

  it('returns id of updated object in users collection on put request', async () => {
    const res = await request(app)
      .put(`${defaultPath}/${mockData[5].id}`)
      .send({
        login: 'Mark',
        password: 'abcdABCD1234',
        age: 30,
        isDeleted: false
      })
      .set('Accept', 'application/json');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
  });

  it('returns id of deleted object in users collection on delete request', async () => {
    const res = await request(app).delete(`${defaultPath}/${mockData[0].id}`);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
  });
});
