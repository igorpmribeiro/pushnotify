-- PushNotify - Database Schema
-- Execute this in Supabase SQL Editor

-- Inscricoes push dos clientes
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT NOT NULL UNIQUE,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_active ON subscriptions (is_active) WHERE is_active = true;

-- Log de notificacoes enviadas
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon_url TEXT,
    target_url TEXT,
    payload JSONB,
    total_recipients INTEGER DEFAULT 0,
    successful_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- Log individual por entrega
CREATE TABLE notification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'expired')),
    error_message TEXT,
    status_code INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notification_logs_notification ON notification_logs (notification_id);

-- Tokens de APIs externas (ex: Rufer/iSet)
CREATE TABLE api_tokens (
    store_id NUMERIC NOT NULL PRIMARY KEY,
    access_token TEXT NOT NULL
);

-- Controle de produtos ja notificados (evita duplicatas)
CREATE TABLE notified_products (
    product_id INTEGER NOT NULL PRIMARY KEY,
    product_name TEXT,
    notified_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: backend usa service_role key, entao permitimos tudo
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Service role full access" ON notifications FOR ALL USING (true);
CREATE POLICY "Service role full access" ON notification_logs FOR ALL USING (true);

ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON api_tokens FOR ALL USING (true);

ALTER TABLE notified_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON notified_products FOR ALL USING (true);
