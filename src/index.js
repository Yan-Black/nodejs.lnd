import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './errorHandlers';
import { usersRouter, groupsRouter } from './routers';
import { db } from './models';

await db.sequelize.sync();

const app = express();
const { PORT } = process.env;

app
  .use(cors())
  .use(express.json())
  .use('/api/v1/users', usersRouter)
  .use('/api/v1/groups', groupsRouter)
  .use(errorHandler);

app.listen(PORT, () => {
  global.console.log(`listening at http://localhost:${PORT}`);
});
