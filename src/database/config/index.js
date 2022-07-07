import 'dotenv/config';

const { DB_NAME_DEV, DB_NAME_TEST, DB_NAME_PROD, USER_NAME, PASSWORD, HOST } =
  process.env;

const baseConfig = {
  username: USER_NAME,
  password: PASSWORD,
  database: DB_NAME_DEV,
  host: HOST,
  dialect: 'postgres'
};

export default {
  development: {
    ...baseConfig
  },
  test: {
    ...baseConfig,
    database: DB_NAME_TEST
  },
  production: {
    ...baseConfig,
    database: DB_NAME_PROD
  }
};
