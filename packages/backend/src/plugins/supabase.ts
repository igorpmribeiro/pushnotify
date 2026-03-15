import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { FastifyInstance } from 'fastify';
import type { Env } from '../config/env.js';

export async function registerSupabase(app: FastifyInstance, env: Env): Promise<void> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  app.decorate('supabase', supabase);
}

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
  }
}
