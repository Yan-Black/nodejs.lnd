import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { logErrors, errorHandler } from './errorHandlers';
import { router } from './router';
import { db } from './model';

await db.sequelize.sync();

const app = express();
const { PORT } = process.env;

app
  .use(cors())
  .use(express.json())
  .use('/api/users', router)
  .use(logErrors)
  .use(errorHandler);

app.listen(PORT, () => {
  global.console.log(`listening at <http://localhost:${PORT}>`);
});
