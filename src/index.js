import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { usersRouter, groupsRouter, loginRouter } from './routers';
import { logger } from './logger';
import { logRequest } from './middlewares';
import { errorHandler } from './errorHandler';

const app = express();
const { PORT } = process.env;

app
  .use(cors())
  .use(express.json())
  .use(logRequest(logger))
  .use('/api/v1/login', loginRouter)
  .use('/api/v1/users', usersRouter)
  .use('/api/v1/groups', groupsRouter)
  .use(errorHandler);

app.listen(PORT, () => {
  logger.info(`listening at http://localhost:${PORT}`);
});
