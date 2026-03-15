import type { SubscriptionRecord } from '@pushnotify/shared';
import type { SubscriptionRepository } from './subscription.repository.js';
import type { CreateSubscriptionInput } from './subscription.schema.js';

export class SubscriptionService {
  constructor(private repository: SubscriptionRepository) {}

  async subscribe(
    input: CreateSubscriptionInput,
    userAgent: string | null,
  ): Promise<SubscriptionRecord> {
    return this.repository.create({
      endpoint: input.endpoint,
      keys_p256dh: input.keys.p256dh,
      keys_auth: input.keys.auth,
      user_agent: userAgent,
    });
  }

  async unsubscribe(endpoint: string): Promise<boolean> {
    return this.repository.deleteByEndpoint(endpoint);
  }

  async getAllActive(): Promise<SubscriptionRecord[]> {
    return this.repository.findAllActive();
  }

  async deactivate(endpoint: string): Promise<void> {
    return this.repository.deactivate(endpoint);
  }
}
