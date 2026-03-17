import type { SupabaseClient } from '@supabase/supabase-js';

const PROVIDER = '7093';

export class TokenRepository {
  constructor(private supabase: SupabaseClient) {}

  async getToken(): Promise<string | null> {
    const { data } = await this.supabase
      .from('api_tokens')
      .select('access_token')
      .eq('store_id', PROVIDER)
      .single();

    return data?.access_token ?? null;
  }

  async saveToken(accessToken: string): Promise<void> {
    const { data: existing } = await this.supabase
      .from('api_tokens')
      .select('id')
      .eq('store_id', PROVIDER)
      .single();

    if (existing) {
      await this.supabase
        .from('api_tokens')
        .update({
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        })
        .eq('store_id', PROVIDER);
    } else {
      await this.supabase
        .from('api_tokens')
        .insert({
          store_id: PROVIDER,
          access_token: accessToken,
        });
    }
  }
}
