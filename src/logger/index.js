import winston from 'winston';

const env = process.env.NODE_ENV;
const isDev = () => env === 'development';

const customLevels = {
  levels: {
    trace: 6,
    debug: 5,
    http: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0
  },
  colors: {
    trace: 'white',
    debug: 'green',
    http: 'magenta',
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    fatal: 'red'
  }
};

const formatter = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    return `${timestamp} [${level}]: ${message}${
      meta?.stack
        ? `
      error.stack: ${JSON.stringify(meta.stack)}
      `
        : ''
    }`;
  })
);

class Logger {
  #logger;

  constructor() {
    const prodTransport = new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    });

    const transport = new winston.transports.Console({
      format: formatter
    });

    this.#logger = winston.createLogger({
      level: isDev() ? 'debug' : 'warn',
      levels: customLevels.levels,
      transports: [isDev() ? transport : prodTransport],
      exceptionHandlers: [transport],
      handleExceptions: true,
      handleRejections: true,
      humanReadableUnhandledException: true,
      exitOnError: false
    });

    winston.addColors(customLevels.colors);
  }

  http(msg, meta) {
    this.#logger.http(msg, meta);
  }

  trace(msg, meta) {
    this.#logger.log('trace', msg, meta);
  }

  debug(msg, meta) {
    this.#logger.debug(msg, meta);
  }

  info(msg, meta) {
    this.#logger.info(msg, meta);
  }

  warn(msg, meta) {
    this.#logger.warn(msg, meta);
  }

  error(msg, meta) {
    this.#logger.error(msg, meta);
  }

  fatal(msg, meta) {
    this.#logger.log('fatal', msg, meta);
  }
}

export const logger = new Logger();
