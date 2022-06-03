import 'dotenv/config';
import express from 'express';
import { router } from './router';

const app = express();
const { PORT } = process.env;

app
  .use(express.json())
  .use('/api/users', router)
  .listen(PORT, () => {
    global.console.log(`listening at ${PORT}`);
  });
