import { z } from 'zod';

export const productChangedWebhookSchema = z.object({
  product_id: z.number().int().positive(),
  sku: z.string(),
  type: z.string(),
  domain: z.string(),
});

export type ProductChangedWebhookInput = z.infer<typeof productChangedWebhookSchema>;
