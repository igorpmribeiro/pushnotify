import webPush from 'web-push';
import type { PushSubscriptionData, NotificationPayload, PushResult } from '@pushnotify/shared';
import type { IPushProvider } from './push.interface.js';

export class WebPushProvider implements IPushProvider {
  async sendNotification(
    subscription: PushSubscriptionData,
    payload: NotificationPayload,
  ): Promise<PushResult> {
    try {
      const result = await webPush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
        JSON.stringify(payload),
        { TTL: 86400 },
      );

      return {
        success: true,
        statusCode: result.statusCode,
      };
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      return {
        success: false,
        statusCode,
        error: (error as Error).message,
      };
    }
  }
}
