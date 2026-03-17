export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    url?: string;
    [key: string]: unknown;
  };
}

export interface NotificationJob {
  subscriptionId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  payload: string;
  notificationId: string;
}

export interface QueueStats {
  pending: number;
  active: number;
  completed: number;
  failed: number;
}

export interface PushResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

export interface ProductChangedWebhookPayload {
  product_id: number;
  sku: string;
  type: string;
  domain: string;
}

export interface SubscriptionRecord {
  id: string;
  endpoint: string;
  keys_p256dh: string;
  keys_auth: string;
  user_agent: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  icon_url: string | null;
  target_url: string | null;
  payload: Record<string, unknown> | null;
  total_recipients: number;
  successful_count: number;
  failed_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
}
