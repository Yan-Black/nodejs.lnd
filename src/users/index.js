import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { catchJsonErrors, errorHandler } from './errorHandlers';
import { router } from './router';
import { db } from './models';

await db.sequelize.sync();

const app = express();
const { PORT } = process.env;

app
  .use(cors())
  .use(express.json())
  .use('/api/v1/users', router)
  .use(catchJsonErrors)
  .use(errorHandler);

app.listen(PORT, () => {
  global.console.log(`listening at <http://localhost:${PORT}>`);
});
