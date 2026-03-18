import type { FastifyBaseLogger } from 'fastify';
import type { NotificationPayload, NotificationJob } from '@pushnotify/shared';
import type { INotificationQueue } from '../../queue/queue.interface.js';
import type { IPushProvider } from '../../push/push.interface.js';
import type { SubscriptionService } from '../subscription/subscription.service.js';
import type { NotificationRepository } from './notification.repository.js';
import type { SendNotificationInput } from './notification.schema.js';

export class NotificationService {
  constructor(
    private subscriptionService: SubscriptionService,
    private notificationRepository: NotificationRepository,
    private queue: INotificationQueue,
    private pushProvider: IPushProvider,
    private logger: FastifyBaseLogger,
  ) {
    this.setupQueueProcessor();
  }

  private successMap = new Map<string, number>();
  private failMap = new Map<string, number>();

  private setupQueueProcessor(): void {
    this.queue.onProcess(async (job: NotificationJob) => {
      const result = await this.pushProvider.sendNotification(
        { endpoint: job.endpoint, keys: job.keys },
        JSON.parse(job.payload) as NotificationPayload,
      );

      const logStatus = result.success ? 'sent' as const :
        (result.statusCode === 410 || result.statusCode === 404) ? 'expired' as const : 'failed' as const;

      await this.notificationRepository.logDelivery({
        notification_id: job.notificationId,
        subscription_id: job.subscriptionId,
        status: logStatus,
        error_message: result.error,
        status_code: result.statusCode,
      });

      if (result.success) {
        this.successMap.set(job.notificationId, (this.successMap.get(job.notificationId) ?? 0) + 1);
      } else {
        this.failMap.set(job.notificationId, (this.failMap.get(job.notificationId) ?? 0) + 1);
        this.logger.warn(
          { endpoint: job.endpoint, statusCode: result.statusCode, error: result.error },
          'Push notification delivery failed',
        );
      }

      if (logStatus === 'expired') {
        this.logger.info({ endpoint: job.endpoint }, 'Deactivating expired subscription');
        await this.subscriptionService.deactivate(job.endpoint);
      }
    });
  }

  async broadcastToAll(input: SendNotificationInput): Promise<string> {
    const subscriptions = await this.subscriptionService.getAllActive();

    const payload: NotificationPayload = {
      title: input.title,
      body: input.body,
      icon: input.icon_url,
      data: input.target_url ? { url: input.target_url } : undefined,
    };

    const notification = await this.notificationRepository.create({
      title: input.title,
      body: input.body,
      icon_url: input.icon_url,
      target_url: input.target_url,
      total_recipients: subscriptions.length,
    });

    this.logger.info(
      { notificationId: notification.id, recipients: subscriptions.length },
      'Broadcasting push notification',
    );

    const payloadStr = JSON.stringify(payload);

    for (const sub of subscriptions) {
      const job: NotificationJob = {
        subscriptionId: sub.id,
        endpoint: sub.endpoint,
        keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
        payload: payloadStr,
        notificationId: notification.id,
      };
      await this.queue.enqueue(job);
    }

    await this.queue.drain();

    const successCount = this.successMap.get(notification.id) ?? 0;
    const failCount = this.failMap.get(notification.id) ?? 0;
    this.successMap.delete(notification.id);
    this.failMap.delete(notification.id);

    await this.notificationRepository.updateCounts(notification.id, successCount, failCount);

    this.logger.info(
      { notificationId: notification.id, successCount, failCount },
      'Broadcast completed',
    );

    return notification.id;
  }
}
