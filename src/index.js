import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './errorHandler';
import { usersRouter, groupsRouter } from './routers';
import { logger } from './logger';
import { logRequest } from './middlewares';
import ErrorHandler from './errorHandler/CentralizedHandler';

const app = express();
const { PORT } = process.env;

app
  .use(cors())
  .use(express.json())
  .use(logRequest)
  .use('/api/v1/users', usersRouter)
  .use('/api/v1/groups', groupsRouter)
  .use(errorHandler);

app.listen(PORT, () => {
  logger.info(`listening at http://localhost:${PORT}`);
});

process
  .on('unhandledRejection', (reason) => {
    throw reason;
  })
  .on('uncaughtException', (error) => {
    ErrorHandler.handleError(error, logger);

    if (!ErrorHandler.isOperational(error)) {
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  });
