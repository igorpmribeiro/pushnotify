import type { FastifyReply, FastifyRequest } from 'fastify';
import { createSubscriptionSchema, deleteSubscriptionSchema } from './subscription.schema.js';
import type { SubscriptionService } from './subscription.service.js';
import { ValidationError } from '../../shared/errors.js';

export class SubscriptionController {
  constructor(private service: SubscriptionService) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = createSubscriptionSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    const userAgent = request.headers['user-agent'] ?? null;
    const subscription = await this.service.subscribe(parsed.data, userAgent);

    request.log.info({ endpoint: subscription.endpoint }, 'New push subscription registered');
    reply.status(201).send({ id: subscription.id });
  }

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = deleteSubscriptionSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    await this.service.unsubscribe(parsed.data.endpoint);

    request.log.info({ endpoint: parsed.data.endpoint }, 'Push subscription removed');
    reply.status(204).send();
  }
}
