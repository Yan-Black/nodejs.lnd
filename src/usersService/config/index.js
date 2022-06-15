import 'dotenv/config';

const { DB_NAME_DEV, DB_NAME_TEST, DB_NAME_PROD, USER_NAME, PASSWORD, HOST } =
  process.env;

export default {
  development: {
    username: USER_NAME,
    password: PASSWORD,
    database: DB_NAME_DEV,
    host: HOST,
    dialect: 'postgres'
  },
  test: {
    username: USER_NAME,
    password: PASSWORD,
    database: DB_NAME_TEST,
    host: HOST,
    dialect: 'postgres'
  },
  production: {
    username: USER_NAME,
    password: PASSWORD,
    database: DB_NAME_PROD,
    host: HOST,
    dialect: 'postgres'
  }
};
