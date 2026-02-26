import pino from 'pino';
import { config } from '@config/env';

const pinoConfig: any = {
  level: config.logging.level,
  base: { service: 'ecommerce-api' },
};

// Use pino-pretty for development, JSON for production
if (config.node_env === 'development') {
  pinoConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
} else {
  pinoConfig.formatters = {
    level: (label: string) => ({ level: label }),
  };
}

export const logger = pino(pinoConfig);

export type Logger = typeof logger;
