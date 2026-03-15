import { z } from 'zod';

export const productWebhookSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image_url: z.string().url().optional(),
  url: z.string().url().optional(),
});

export type ProductWebhookInput = z.infer<typeof productWebhookSchema>;
