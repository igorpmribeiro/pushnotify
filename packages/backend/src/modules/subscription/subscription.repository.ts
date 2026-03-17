import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubscriptionRecord } from '@pushnotify/shared';

export class SubscriptionRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(data: {
    endpoint: string;
    keys_p256dh: string;
    keys_auth: string;
    user_agent: string | null;
  }): Promise<SubscriptionRecord> {
    const { data: record, error } = await this.supabase
      .from('subscriptions')
      .upsert(
        { ...data, is_active: true, updated_at: new Date().toISOString() },
        { onConflict: 'endpoint' },
      )
      .select()
      .single();

    if (error) throw error;
    return record as SubscriptionRecord;
  }

  async findAllActive(): Promise<SubscriptionRecord[]> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return (data ?? []) as SubscriptionRecord[];
  }

  async deactivate(endpoint: string): Promise<void> {
    const { error } = await this.supabase
      .from('subscriptions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('endpoint', endpoint);

    if (error) throw error;
  }

  async deleteByEndpoint(endpoint: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .delete()
      .eq('endpoint', endpoint)
      .select('id');

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }

  async countActive(): Promise<number> {
    const { count, error } = await this.supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) throw error;
    return count ?? 0;
  }
}
