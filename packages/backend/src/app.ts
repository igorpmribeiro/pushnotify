import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import type { Env } from './config/env.js';
import { configureVapid } from './config/vapid.js';
import { registerCors } from './plugins/cors.js';
import { registerRateLimit } from './plugins/rate-limit.js';
import { registerSupabase } from './plugins/supabase.js';
import { errorHandler } from './shared/error-handler.js';
import { subscriptionRoutes } from './modules/subscription/subscription.routes.js';
import { notificationRoutes } from './modules/notification/notification.routes.js';
import { webhookRoutes } from './modules/webhook/webhook.routes.js';

export async function buildApp(env: Env) {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
      ...(env.NODE_ENV !== 'production' && {
        transport: { target: 'pino-pretty', options: { colorize: true } },
      }),
    },
  });

  app.decorate('env', env);

  configureVapid(env);

  await app.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === 'production',
  });
  await registerCors(app, env.CORS_ORIGIN);
  await registerRateLimit(app);
  await registerSupabase(app, env);

  app.setErrorHandler(errorHandler);

  app.get('/api/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  app.get('/api/vapid/public-key', async () => ({
    publicKey: env.VAPID_PUBLIC_KEY,
  }));

  await app.register(
    async (instance) => {
      await instance.register(subscriptionRoutes);
      await instance.register(notificationRoutes);
      await instance.register(webhookRoutes);
    },
    { prefix: '/api' },
  );

  return app;
}
