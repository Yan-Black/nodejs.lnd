import { Sequelize } from 'sequelize';
import config from '../config';
import user from './user.model';
import { fillWithPredifinedDataIfEmpty } from '../config/fillWithPredifinedDataIfEmpty';

const { dbName, userName, password, ...options } = config;

const sequelize = new Sequelize(dbName, userName, password, options);

const db = {
  Sequelize,
  sequelize,
  user: user(sequelize, Sequelize)
};

await fillWithPredifinedDataIfEmpty(db);

export { db };
