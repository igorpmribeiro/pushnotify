import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendNotificationSchema } from './notification.schema.js';
import type { NotificationService } from './notification.service.js';
import type { NotificationRepository } from './notification.repository.js';
import { ValidationError } from '../../shared/errors.js';

export class NotificationController {
  constructor(
    private service: NotificationService,
    private repository: NotificationRepository,
  ) {}

  async send(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = sendNotificationSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    const notificationId = await this.service.broadcastToAll(parsed.data);

    reply.status(202).send({
      message: 'Notification queued for delivery',
      notificationId,
    });
  }

  async list(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { limit = 50, offset = 0 } = request.query as { limit?: number; offset?: number };
    const notifications = await this.repository.findAll(
      Math.min(limit, 100),
      offset,
    );
    reply.send({ data: notifications });
  }
}
