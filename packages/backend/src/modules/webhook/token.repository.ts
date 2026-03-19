import type { SupabaseClient } from '@supabase/supabase-js';

const APP_NAME = 'push_app';

export class TokenRepository {
  constructor(private supabase: SupabaseClient) {}

  async getToken(): Promise<string | null> {
    const { data } = await this.supabase
      .from('api_tokens')
      .select('access_token')
      .eq('app_name', APP_NAME)
      .single();

    return data?.access_token ?? null;
  }

  async saveToken(accessToken: string): Promise<void> {
    const { data: existing } = await this.supabase
      .from('api_tokens')
      .select('id')
      .eq('app_name', APP_NAME)
      .single();

    if (existing) {
      await this.supabase
        .from('api_tokens')
        .update({
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        })
        .eq('app_name', APP_NAME);
    } else {
      await this.supabase
        .from('api_tokens')
        .insert({
          app_name: APP_NAME,
          access_token: accessToken,
        });
    }
  }
}
