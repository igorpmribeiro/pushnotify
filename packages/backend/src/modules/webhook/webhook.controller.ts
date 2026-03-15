import type { FastifyReply, FastifyRequest } from 'fastify';
import { productWebhookSchema } from './webhook.schema.js';
import { WebhookService } from './webhook.service.js';
import type { NotificationService } from '../notification/notification.service.js';
import { ValidationError } from '../../shared/errors.js';

export class WebhookController {
  private webhookService = new WebhookService();

  constructor(private notificationService: NotificationService) {}

  async handleNewProduct(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = productWebhookSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    const notification = this.webhookService.transformProductToNotification(parsed.data);
    const notificationId = await this.notificationService.broadcastToAll(notification);

    request.log.info(
      { productId: parsed.data.id, productName: parsed.data.name, notificationId },
      'Webhook processed: new product notification queued',
    );

    reply.status(202).send({
      message: 'Notification queued',
      notificationId,
    });
  }
}
