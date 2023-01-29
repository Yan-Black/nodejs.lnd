import morgan from 'morgan';

morgan.token('body', (req) => `req.body:${JSON.stringify(req.body)}`);

export const logRequest = (logger = global.console) =>
  morgan(
    ':method :url :status :body :res[content-length] - :response-time ms',
    {
      stream: {
        write(message) {
          logger.http ? logger.http(message) : logger.log(message);
        }
      }
    }
  );
