import type { NotificationJob, QueueStats } from '@pushnotify/shared';

export interface INotificationQueue {
  enqueue(job: NotificationJob): Promise<void>;
  onProcess(handler: (job: NotificationJob) => Promise<void>): void;
  drain(): Promise<void>;
  getStats(): Promise<QueueStats>;
}
