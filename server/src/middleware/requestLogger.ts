import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@utils/logger';

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => (req.headers['x-request-id'] as string) || uuidv4(),
  customLogLevel: (_req, res) => {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
