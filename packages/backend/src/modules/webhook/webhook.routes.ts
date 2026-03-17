import type { FastifyInstance } from 'fastify';
import { WebhookController } from './webhook.controller.js';
import { TokenRepository } from './token.repository.js';
import { NotifiedProductRepository } from './notified-product.repository.js';
import { RuferApiClient } from './rufer-api.client.js';
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

  const tokenRepo = new TokenRepository(app.supabase);
  const ruferApiClient = new RuferApiClient(
    tokenRepo,
    {
      baseUrl: app.env.RUFER_API_URL,
      clientId: app.env.RUFER_CLIENT_ID,
      clientSecret: app.env.RUFER_CLIENT_SECRET,
    },
    app.log,
  );

  const notifiedProductRepo = new NotifiedProductRepository(app.supabase);
  const controller = new WebhookController(notificationService, ruferApiClient, notifiedProductRepo);
  const webhookAuth = createWebhookAuthHook(app.env.WEBHOOK_SECRET);

  app.post('/webhooks/product-changed', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    preHandler: webhookAuth,
    handler: controller.handleProductChanged.bind(controller),
  });
}
