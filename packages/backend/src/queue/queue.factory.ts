import type { INotificationQueue } from './queue.interface.js';
import { InMemoryQueue } from './in-memory-queue.js';

export function createQueue(): INotificationQueue {
  return new InMemoryQueue(10);
}
