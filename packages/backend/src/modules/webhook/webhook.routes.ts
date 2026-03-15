import type { FastifyInstance } from 'fastify';
import { WebhookController } from './webhook.controller.js';
import { NotificationService } from '../notification/notification.service.js';
import { NotificationRepository } from '../notification/notification.repository.js';
import { SubscriptionService } from '../subscription/subscription.service.js';
import { SubscriptionRepository } from '../subscription/subscription.repository.js';
import { WebPushProvider } from '../../push/web-push.provider.js';
import { createQueue } from '../../queue/queue.factory.js';
import { createWebhookAuthHook } from '../../plugins/webhook-auth.js';

export async function webhookRoutes(app: FastifyInstance): Promise<void> {
  const subscriptionRepo = new SubscriptionRepository(app.supabase);
  const subscriptionService = new SubscriptionService(subscriptionRepo);
  const notificationRepo = new NotificationRepository(app.supabase);
  const pushProvider = new WebPushProvider();
  const queue = createQueue();

  const notificationService = new NotificationService(
    subscriptionService,
    notificationRepo,
    queue,
    pushProvider,
    app.log,
  );

  const controller = new WebhookController(notificationService);
  const webhookAuth = createWebhookAuthHook(app.env.WEBHOOK_SECRET);

  app.post('/webhooks/new-product', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    preHandler: webhookAuth,
    handler: controller.handleNewProduct.bind(controller),
  });
}
