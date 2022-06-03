import mockData from './mockData';

class UsersList {
  constructor() {
    this.usersList = mockData;
  }

  getUsers() {
    return this.usersList.filter(({ isDeleted }) => !isDeleted);
  }

  getUserById(id) {
    const user = this.usersList.find(
      (userData) => userData.id === id && !userData.isDeleted
    );

    return user || null;
  }

  getAutoSuggestUsers(loginSubstring, limit) {
    const searchSubstringToLower = loginSubstring.toLowerCase();

    const filteredUsers = this.usersList.filter(({ login }) => {
      const loginToLower = login.toLowerCase();

      return loginToLower.includes(searchSubstringToLower);
    });

    return filteredUsers.slice(0, limit);
  }

  createUser(user) {
    !this.getUserById(user.id) && this.usersList.push(user);
  }

  softDeleteUser(id) {
    const userToDelete = this.getUserById(id);

    if (userToDelete) {
      userToDelete.isDeleted = true;
      return userToDelete;
    }

    throw Error;
  }

  updateUser(user) {
    const userToUpdate = this.getUserById(user.id);

    if (userToUpdate) {
      Object.assign(userToUpdate, user);
      return userToUpdate;
    }

    throw Error;
  }
}

const usersList = new UsersList();

export { usersList };
