import type { FastifyReply, FastifyRequest } from 'fastify';
import { productChangedWebhookSchema } from './webhook.schema.js';
import { WebhookService } from './webhook.service.js';
import type { RuferApiClient } from './rufer-api.client.js';
import type { NotifiedProductRepository } from './notified-product.repository.js';
import type { NotificationService } from '../notification/notification.service.js';
import { ValidationError } from '../../shared/errors.js';

export class WebhookController {
  private webhookService = new WebhookService();

  constructor(
    private notificationService: NotificationService,
    private ruferApiClient: RuferApiClient,
    private notifiedProductRepo: NotifiedProductRepository,
  ) {}

  async handleProductChanged(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = productChangedWebhookSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    const { product_id, type, domain } = parsed.data;

    request.log.info({ product_id, type, domain }, 'Webhook received: product changed');

    const alreadyNotified = await this.notifiedProductRepo.exists(product_id);
    if (alreadyNotified) {
      request.log.info({ product_id }, 'Product already notified, skipping');
      reply.status(200).send({ message: 'Product already notified, skipped' });
      return;
    }

    const product = await this.ruferApiClient.getProduct(product_id);

    const isToday = this.isDateToday(product.date_added);
    if (!isToday) {
      request.log.info(
        { product_id, date_added: product.date_added },
        'Product date_added is not today, skipping',
      );
      reply.status(200).send({ message: 'Product is not new, skipped' });
      return;
    }

    const notification = this.webhookService.transformProductToNotification(product);
    const notificationId = await this.notificationService.broadcastToAll(notification);

    await this.notifiedProductRepo.markNotified(product_id, product.name);

    request.log.info(
      { productId: product_id, productName: product.name, notificationId },
      'Webhook processed: new product notification queued',
    );

    reply.status(202).send({
      message: 'Notification queued',
      notificationId,
    });
  }

  private isDateToday(dateStr: string): boolean {
    const now = new Date();
    const productDate = new Date(dateStr.replace(' ', 'T') + '-03:00');

    return (
      productDate.getFullYear() === now.getFullYear() &&
      productDate.getMonth() === now.getMonth() &&
      productDate.getDate() === now.getDate()
    );
  }
}
