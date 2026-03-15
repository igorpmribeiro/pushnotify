import type { IncomingMessage, ServerResponse } from 'node:http';
import { loadEnv } from '../packages/backend/src/config/env.js';
import { buildApp } from '../packages/backend/src/app.js';

let app: Awaited<ReturnType<typeof buildApp>> | null = null;

async function getApp() {
  if (app) return app;
  const env = loadEnv();
  app = await buildApp(env);
  await app.ready();
  return app;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const fastify = await getApp();
  fastify.server.emit('request', req, res);
}
