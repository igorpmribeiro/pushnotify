import { z } from 'zod';

export const sendNotificationSchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  icon_url: z.string().url().optional(),
  target_url: z.string().url().optional(),
});

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
