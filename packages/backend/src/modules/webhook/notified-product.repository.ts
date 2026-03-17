import type { SupabaseClient } from '@supabase/supabase-js';

export class NotifiedProductRepository {
  constructor(private supabase: SupabaseClient) {}

  async exists(productId: number): Promise<boolean> {
    const { data } = await this.supabase
      .from('notified_products')
      .select('product_id')
      .eq('product_id', productId)
      .single();

    return data !== null;
  }

  async markNotified(productId: number, productName: string): Promise<void> {
    await this.supabase
      .from('notified_products')
      .insert({ product_id: productId, product_name: productName });
  }
}
