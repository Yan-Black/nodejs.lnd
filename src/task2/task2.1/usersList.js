class UsersList {
  constructor() {
    this.usersList = [];
  }

  getUserById(id) {
    const user = this.usersList.find(
      (user) => user.id === id && !user.isDeleted
    );

    return user || null;
  }

  getAutoSuggestUsers(loginSubstring, limit) {
    const filteredUsers = this.usersList.filter((user) => {
      return user.login.includes(loginSubstring);
    });

    return filteredUsers.slice(0, limit);
  }

  createUser(user) {
    this.usersList.push(user);
  }

  softDeleteUser(id) {
    return new Promise((resolve, reject) => {
      const userToDelete = this.getUserById(id);

      if (userToDelete) {
        userToDelete.isDeleted = true;
        resolve();
      }

      reject();
    });
  }

  updateUser(user) {
    return new Promise((resolve, reject) => {
      const userToUpdate = this.getUserById(user.id);

      if (userToUpdate) {
        Object.assign(userToUpdate, user);
        resolve();
      }

      reject();
    });
  }
}

const usersList = new UsersList();

export { usersList };
