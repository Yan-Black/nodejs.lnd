import { Sequelize } from 'sequelize';
import config from '../config';
import userModelInit from './user';
import groupModelInit from './group';

const env = process.env.NODE_ENV || 'development';
const { database, username, password, ...options } = config[env];

const sequelize = new Sequelize(database, username, password, options);

const User = userModelInit(sequelize, Sequelize.DataTypes);
const Group = groupModelInit(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  Group
};

[db.User, db.Group].forEach((model) => model.associate?.(db));

export { db };
