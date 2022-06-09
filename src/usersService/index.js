import 'dotenv/config';
import express from 'express';
import { logErrors, errorHandler } from './errorHandlers';
import { router } from './router';

const app = express();
const { PORT } = process.env;

app
  .use(express.json())
  .use('/api/users', router)
  .use(logErrors)
  .use(errorHandler);

app.listen(PORT, () => {
  global.console.log(`listening at <http://localhost:${PORT}>`);
});
