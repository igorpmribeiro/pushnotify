import webPush from 'web-push';
import type { Env } from './env.js';

export function configureVapid(env: Env): void {
  webPush.setVapidDetails(
    env.VAPID_SUBJECT,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY,
  );
}
