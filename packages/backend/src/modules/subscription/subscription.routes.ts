import type { FastifyInstance } from 'fastify';
import { SubscriptionController } from './subscription.controller.js';
import { SubscriptionService } from './subscription.service.js';
import { SubscriptionRepository } from './subscription.repository.js';

export async function subscriptionRoutes(app: FastifyInstance): Promise<void> {
  const repository = new SubscriptionRepository(app.supabase);
  const service = new SubscriptionService(repository);
  const controller = new SubscriptionController(service);

  app.post('/subscriptions', {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    handler: controller.create.bind(controller),
  });

  app.delete('/subscriptions', {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    handler: controller.delete.bind(controller),
  });
}
