import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { usersRouter, groupsRouter } from './routers';
import { logger } from './logger';
import { logRequest } from './middlewares';
import ErrorHandler from './errorHandler/CentralizedHandler';

const app = express();
const { PORT } = process.env;

app
  .use(cors())
  .use(express.json())
  .use(logRequest(logger))
  .use('/api/v1/users', usersRouter)
  .use('/api/v1/groups', groupsRouter)
  .use(ErrorHandler.handleError);

app.listen(PORT, () => {
  logger.http(`listening at http://localhost:${PORT}`);
});

process
  .on('unhandledRejection', ErrorHandler.handleUnhandledRejection)
  .on('uncaughtException', ErrorHandler.handleUncaughtException);
