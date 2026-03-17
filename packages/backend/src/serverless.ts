import type { IncomingMessage, ServerResponse } from 'node:http';
import { loadEnv } from './config/env.js';
import { buildApp } from './app.js';

let app: Awaited<ReturnType<typeof buildApp>> | null = null;

async function getApp() {
  if (app) return app;
  const env = loadEnv();
  app = await buildApp(env);
  await app.ready();
  return app;
}

async function handler(req: IncomingMessage, res: ServerResponse) {
  const fastify = await getApp();
  fastify.server.emit('request', req, res);
}

export default handler;
export { handler };
