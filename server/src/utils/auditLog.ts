import { prisma } from '@config/database';
import { logger } from '@utils/logger';

interface AuditLogInput {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export const createAuditLog = async (input: AuditLogInput): Promise<void> => {
  try {
    await prisma.auditLog.create({ data: input });
  } catch (err) {
    logger.error({ err, input }, 'Failed to create audit log');
  }
};
