import PQueue from 'p-queue';
import type { NotificationJob, QueueStats } from '@pushnotify/shared';
import type { INotificationQueue } from './queue.interface.js';

export class InMemoryQueue implements INotificationQueue {
  private queue: PQueue;
  private handler: ((job: NotificationJob) => Promise<void>) | null = null;
  private stats: QueueStats = { pending: 0, active: 0, completed: 0, failed: 0 };

  constructor(concurrency = 10) {
    this.queue = new PQueue({
      concurrency,
      interval: 1000,
      intervalCap: concurrency,
    });
  }

  async enqueue(job: NotificationJob): Promise<void> {
    if (!this.handler) {
      throw new Error('No handler registered. Call onProcess before enqueue.');
    }

    this.stats.pending++;

    const handler = this.handler;
    this.queue.add(async () => {
      this.stats.pending--;
      this.stats.active++;
      try {
        await handler(job);
        this.stats.completed++;
      } catch {
        this.stats.failed++;
      } finally {
        this.stats.active--;
      }
    });
  }

  onProcess(handler: (job: NotificationJob) => Promise<void>): void {
    this.handler = handler;
  }

  async getStats(): Promise<QueueStats> {
    return { ...this.stats };
  }
}
