import type { SupabaseClient } from '@supabase/supabase-js';
import type { NotificationRecord } from '@pushnotify/shared';

export class NotificationRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(data: {
    title: string;
    body: string;
    icon_url?: string;
    target_url?: string;
    payload?: Record<string, unknown>;
    total_recipients: number;
  }): Promise<NotificationRecord> {
    const { data: record, error } = await this.supabase
      .from('notifications')
      .insert({ ...data, status: 'processing' })
      .select()
      .single();

    if (error) throw error;
    return record as NotificationRecord;
  }

  async logDelivery(data: {
    notification_id: string;
    subscription_id: string;
    status: 'sent' | 'failed' | 'expired';
    error_message?: string;
    status_code?: number;
  }): Promise<void> {
    const { error } = await this.supabase
      .from('notification_logs')
      .insert(data);

    if (error) throw error;
  }

  async updateCounts(
    notificationId: string,
    successCount: number,
    failCount: number,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({
        successful_count: successCount,
        failed_count: failCount,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) throw error;
  }

  async findAll(limit = 50, offset = 0): Promise<NotificationRecord[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data ?? []) as NotificationRecord[];
  }
}
