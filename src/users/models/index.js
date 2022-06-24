import { Sequelize } from 'sequelize';
import config from '../config';
import modelInit from './user';

const env = process.env.NODE_ENV || 'development';
const { database, username, password, ...options } = config[env];

const sequelize = new Sequelize(database, username, password, options);

const User = modelInit(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  User
};

db.User.associate?.(db);

export { db };
