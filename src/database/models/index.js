import { Sequelize } from 'sequelize';
import config from '../config';
import userModelInit from './user';
import groupModelInit from './group';
import userGroupModelInit from './userGroup';

const env = process.env.NODE_ENV;
const { database, username, password, ...options } = config[env];

const sequelize = new Sequelize(database, username, password, {
  ...options,
  logging: false
});

const User = userModelInit(sequelize, Sequelize.DataTypes);
const Group = groupModelInit(sequelize, Sequelize.DataTypes);
const UserGroup = userGroupModelInit(sequelize);

const db = {
  sequelize,
  Sequelize,
  User,
  Group,
  UserGroup
};

[User, Group].forEach((Model) => Model.associate(db));

export { db };
