import { expect } from '@jest/globals';

export const expectToMatchGroupSchema = (group) => {
  expect(group).toHaveProperty('id');
  expect(group).toHaveProperty('name');
  expect(group).toHaveProperty('permissions');
  expect(group.permissions).toBeInstanceOf(Array);
};

export const expectToMatchUserSchema = (user) => {
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('login');
  expect(user).toHaveProperty('password');
  expect(user).toHaveProperty('age');
};
