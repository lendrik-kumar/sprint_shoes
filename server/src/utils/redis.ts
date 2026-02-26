import { createClient } from 'redis';
import { config } from '@config/env';
import { logger } from '@utils/logger';

const client = createClient({ url: config.redis.url });

client.on('error', (err) => { logger.error({ err }, 'Redis Client Error'); });
client.on('connect', () => { logger.info('Redis client connected'); });
client.on('ready', () => { logger.info('Redis client ready'); });

(async () => {
  if (!client.isOpen) await client.connect();
})().catch((err) => logger.error({ err }, 'Redis connect failed'));

export const redis = {
  get: async (key: string): Promise<string | null> => {
    try { return await client.get(key); }
    catch (err) { logger.error({ err, key }, 'Redis GET error'); return null; }
  },

  set: async (key: string, value: string, exSeconds?: number): Promise<boolean> => {
    try {
      if (exSeconds) await client.setEx(key, exSeconds, value);
      else await client.set(key, value);
      return true;
    } catch (err) { logger.error({ err, key }, 'Redis SET error'); return false; }
  },

  del: async (...keys: string[]): Promise<boolean> => {
    try { await client.del(keys); return true; }
    catch (err) { logger.error({ err, keys }, 'Redis DEL error'); return false; }
  },

  exists: async (key: string): Promise<boolean> => {
    try { return (await client.exists(key)) === 1; }
    catch (err) { logger.error({ err, key }, 'Redis EXISTS error'); return false; }
  },

  incr: async (key: string): Promise<number> => {
    try { return await client.incr(key); }
    catch (err) { logger.error({ err, key }, 'Redis INCR error'); return 0; }
  },

  expire: async (key: string, seconds: number): Promise<boolean> => {
    try { return await client.expire(key, seconds); }
    catch (err) { logger.error({ err, key }, 'Redis EXPIRE error'); return false; }
  },

  ttl: async (key: string): Promise<number> => {
    try { return await client.ttl(key); }
    catch (err) { logger.error({ err, key }, 'Redis TTL error'); return -1; }
  },

  flush: async (): Promise<boolean> => {
    try { await client.flushDb(); return true; }
    catch (err) { logger.error({ err }, 'Redis FLUSH error'); return false; }
  },

  disconnect: async (): Promise<void> => { await client.disconnect(); },

  isConnected: (): boolean => client.isReady,

  ping: async (): Promise<boolean> => {
    try { return (await client.ping()) === 'PONG'; }
    catch { return false; }
  },
};

export const getCacheKey = (prefix: string, key: string): string => `${prefix}:${key}`;

export const CACHE_KEYS = {
  USER: (id: string) => getCacheKey('user', id),
  PRODUCT: (id: string) => getCacheKey('product', id),
  PRODUCTS_LIST: (hash: string) => getCacheKey('products', hash),
  CART: (userId: string) => getCacheKey('cart', userId),
  OTP: (phone: string) => getCacheKey('otp', phone),
  SESSION: (sessionId: string) => getCacheKey('session', sessionId),
  BLACKLIST: (token: string) => getCacheKey('blacklist', token),
  RATE_LIMIT: (id: string) => getCacheKey('ratelimit', id),
  IDEMPOTENCY: (key: string) => getCacheKey('idempotency', key),
  PAYMENT_INTENT: (id: string) => getCacheKey('payment_intent', id),
};
