import 'dotenv/config';

const { DB_NAME, USER_NAME, PASSWORD, HOST } = process.env;

export default {
  dbName: DB_NAME,
  userName: USER_NAME,
  password: PASSWORD,
  host: HOST,
  dialect: 'postgres'
};
