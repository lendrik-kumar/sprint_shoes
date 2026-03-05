import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { config } from '@config/env';
import apiRoutes from '@routes/api.routes';
import {
  authenticate,
  authorize,
  errorHandler,
  notFoundHandler,
  requestLogger,
  xss,
  hppProtection,
} from '@middleware/index';
import { AuthenticatedRequest, UserRole } from '@types';
import { asyncHandler } from '@utils/asyncHandler';

const app: Express = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:', '*'],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ── Serve uploaded product images (cross-origin allowed) ─────────────────────
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', (_req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(uploadsDir));

app.use(xss);
app.use(hppProtection);

app.use((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  const corsOrigins = [config.cors.frontendUrl, config.cors.adminUrl];
  const origin = req.headers.origin as string;

  if (corsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(requestLogger);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get(
  '/readiness',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    res.json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  })
);

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'E-Commerce API v1',
    endpoints: {
      health: '/health',
      readiness: '/readiness',
      auth: '/api/auth',
      docs: '/api/docs',
    },
  });
});

export default app;
