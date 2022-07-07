import morgan from 'morgan';
import { logger } from '../logger';

morgan.token('body', (req) => `req.body:${JSON.stringify(req.body)}`);

export const logRequest = morgan(
  ':method :url :status :body :res[content-length] - :response-time ms',
  {
    stream: {
      write(message) {
        logger.http(message);
      }
    }
  }
);
