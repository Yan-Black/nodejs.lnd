import { v4 as uuidv4 } from 'uuid';
import { usersList } from '.';

const id = uuidv4();

const mockUser = {
  id,
  login: 'Yan',
  password: '12345abcdE',
  isDeleted: false,
  age: 29
};

test('shuld return mock users collection', () => {
  const list = usersList.getUsers();
  expect(list).toHaveLength(10);
});

test('should add new user to the collection if input data is valid', () => {
  usersList.usersList = [];
  usersList.createUser(mockUser);

  expect(usersList.usersList).toHaveLength(1);
});

test('usersList returns null if no user found or id is invalid', () => {
  expect(usersList.getUserById('')).toBeNull();
});

test('usersList returns object with user data if user exists under specified id', () => {
  const user = usersList.getUserById(id);

  expect(user).toBeDefined();
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('login');
  expect(user).toHaveProperty('password');
  expect(user).toHaveProperty('isDeleted');
  expect(user).toHaveProperty('age');
});

test('usersList getAutoSuggestUsers return empty array if no match with specified login substring parameter', () => {
  const suggestedList = usersList.getAutoSuggestUsers('ihar', 1);

  expect(suggestedList).toBeDefined();
  expect(suggestedList).toHaveLength(0);
});

test('usersList getAutoSuggestUsers return list of users matching specified parameters', () => {
  const suggestedList = usersList.getAutoSuggestUsers('yan', 1);

  expect(suggestedList).toBeDefined();
  expect(suggestedList).toHaveLength(1);
});

test('should change user isDeleted property to true if delete method called', () => {
  const respId = usersList.softDeleteUser(id);
  const deleted = usersList.usersList.find(
    ({ id: userId }) => userId === respId
  );

  expect(deleted.isDeleted).toBeTruthy();
});

test('should update user data when update method with valid input called', () => {
  const testId = uuidv4();

  const initialUserData = {
    id: testId,
    login: 'Dmytro',
    password: '12345abcdE',
    isDeleted: false,
    age: 22
  };

  const updatedUserData = {
    login: 'Oleh',
    password: '12345abcdE',
    isDeleted: false,
    age: 33
  };

  usersList.createUser(initialUserData);

  const respId = usersList.updateUser(testId, updatedUserData);
  const updated = usersList.usersList.find(
    ({ id: userId }) => userId === respId
  );

  expect(updated.login).toMatch('Oleh');
});
