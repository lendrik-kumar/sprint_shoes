import dotenv from 'dotenv';

dotenv.config();

export const config = {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',

  database: {
    url: process.env.DATABASE_URL || '',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    resetSecret: process.env.JWT_RESET_SECRET || 'reset-secret',
    otpSecret: process.env.JWT_OTP_SECRET || 'otp-secret',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    otpExpiry: process.env.JWT_OTP_EXPIRY || '10m',
  },

  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
  },

  otp: {
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
    validityMinutes: parseInt(process.env.OTP_VALIDITY_MINUTES || '10', 10),
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:5174',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  security: {
    helmetEnabled: process.env.HELMET_ENABLED === 'true',
    csrfProtectionEnabled: process.env.CSRF_PROTECTION_ENABLED === 'true',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};

const requiredEnvVars = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

const validateConfig = (): void => {
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
};

validateConfig();
