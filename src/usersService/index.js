import express from 'express';
import { router } from './router';

const app = express();

app.use(express.json()).use('/api/users', router).listen(8080);
