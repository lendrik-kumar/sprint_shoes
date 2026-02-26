import app from './index';
import { config } from '@config/env';
import { redis } from '@utils/redis';

const start = async (): Promise<void> => {
  try {
    const server = app.listen(config.port, config.host, () => {
      console.log(`
        🚀 Server running at http://${config.host}:${config.port}
        📡 Environment: ${config.node_env}
        🔐 Security: Helmet enabled
        💾 Database: ${config.database.url ? 'Connected' : 'Not configured'}
        🔴 Redis: ${config.redis.url ? 'Ready' : 'Not configured'}
      `);
    });

    const gracefulShutdown = async (): Promise<void> => {
      console.log('\n📛 Shutting down gracefully...');

      server.close(async () => {
        console.log('✅ HTTP server closed');
        await redis.disconnect();
        console.log('✅ Redis disconnected');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('❌ Forced shutdown after 10 seconds');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    process.on('uncaughtException', (error: Error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      console.error('❌ Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();
