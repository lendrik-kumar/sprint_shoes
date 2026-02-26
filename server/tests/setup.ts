import { prisma } from '../src/config/database';
import { redis } from '../src/utils/redis';

beforeAll(async () => {
  // Connect cleanly if not already
});

afterAll(async () => {
  await prisma.$disconnect();
  await redis.disconnect();
});
