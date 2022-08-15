import request from 'supertest';
import express from 'express';
import { describe, expect, it } from '@jest/globals';
import { usersRouter } from '../users';

const defaultPath = '/api/v1/groups';
const app = express();
app.use(express.json());
app.use(defaultPath, usersRouter);

describe('Groups Service -> Test Routes', () => {
  it('returns all users on get request', async () => {
    const res = await request(app).get(defaultPath);

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

  it('returns newly created object in groups collection on post request', async () => {
    const mockGroup = {
      name: 'visitors',
      permissions: ['READ']
    };

    const res = await request(app)
      .post(defaultPath)
      .send(mockGroup)
      .set('Accept', 'application/json');

    const { body } = res;
    const { name, permissions } = body;

    const toVerify = {
      name,
      permissions
    };

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(body).toHaveProperty('id');
    expect(toVerify).toMatchObject(mockGroup);
  });

  it('returns group on put request', async () => {
    const { body } = await request(app).get(defaultPath);
    const [{ id }] = body.data;

    const mockGroup = {
      id,
      name: 'customers',
      permissions: ['READ', 'WRITE', 'SHARE']
    };

    const res = await request(app)
      .put(`${defaultPath}/${id}`)
      .send(mockGroup)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(mockGroup);
  });

  it('returns 204 status code on delete request', async () => {
    const { body } = await request(app).get(defaultPath);
    const [{ id }] = body.data;

    const res = await request(app).delete(`${defaultPath}/${id}`);

    expect(res.statusCode).toBe(204);
  });
});
