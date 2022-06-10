export default (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    login: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    age: {
      type: Sequelize.INTEGER
    },
    isDeleted: {
      type: Sequelize.BOOLEAN
    }
  });

  return User;
};
