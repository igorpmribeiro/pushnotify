import type { NotificationJob, QueueStats } from '@pushnotify/shared';

export interface INotificationQueue {
  enqueue(job: NotificationJob): Promise<void>;
  onProcess(handler: (job: NotificationJob) => Promise<void>): void;
  getStats(): Promise<QueueStats>;
}
