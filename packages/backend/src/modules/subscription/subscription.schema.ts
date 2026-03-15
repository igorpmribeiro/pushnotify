import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export const deleteSubscriptionSchema = z.object({
  endpoint: z.string().url(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type DeleteSubscriptionInput = z.infer<typeof deleteSubscriptionSchema>;
