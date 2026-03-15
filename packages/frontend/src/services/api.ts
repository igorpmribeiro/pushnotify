const API_URL = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getVapidPublicKey(): Promise<string> {
  const data = await request<{ publicKey: string }>('/api/vapid/public-key');
  return data.publicKey;
}

export async function registerSubscription(subscription: PushSubscription): Promise<void> {
  const json = subscription.toJSON();
  await request('/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: json.keys?.p256dh,
        auth: json.keys?.auth,
      },
    }),
  });
}

export async function removeSubscription(endpoint: string): Promise<void> {
  await request('/api/subscriptions', {
    method: 'DELETE',
    body: JSON.stringify({ endpoint }),
  });
}
