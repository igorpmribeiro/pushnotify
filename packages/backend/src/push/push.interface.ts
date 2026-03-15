import type { PushSubscriptionData, NotificationPayload, PushResult } from '@pushnotify/shared';

export interface IPushProvider {
  sendNotification(
    subscription: PushSubscriptionData,
    payload: NotificationPayload,
  ): Promise<PushResult>;
}
