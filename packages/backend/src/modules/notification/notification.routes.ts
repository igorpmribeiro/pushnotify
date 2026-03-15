import type { FastifyInstance } from 'fastify';
import { NotificationController } from './notification.controller.js';
import { NotificationRepository } from './notification.repository.js';
import { NotificationService } from './notification.service.js';
import { SubscriptionService } from '../subscription/subscription.service.js';
import { SubscriptionRepository } from '../subscription/subscription.repository.js';
import { WebPushProvider } from '../../push/web-push.provider.js';
import { createQueue } from '../../queue/queue.factory.js';
import { UnauthorizedError } from '../../shared/errors.js';
import type { Env } from '../../config/env.js';

export async function notificationRoutes(app: FastifyInstance): Promise<void> {
  const env = app.env;

  const subscriptionRepo = new SubscriptionRepository(app.supabase);
  const subscriptionService = new SubscriptionService(subscriptionRepo);

  const notificationRepo = new NotificationRepository(app.supabase);
  const pushProvider = new WebPushProvider();
  const queue = createQueue();

  const service = new NotificationService(
    subscriptionService,
    notificationRepo,
    queue,
    pushProvider,
    app.log,
  );

  const controller = new NotificationController(service, notificationRepo);

  const adminAuth = async (request: { headers: { authorization?: string } }) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (token !== env.ADMIN_API_KEY) {
      throw new UnauthorizedError('Invalid admin API key');
    }
  };

  app.post('/notifications/send', {
    preHandler: adminAuth,
    handler: controller.send.bind(controller),
  });

  app.get('/notifications', {
    preHandler: adminAuth,
    handler: controller.list.bind(controller),
  });
}
