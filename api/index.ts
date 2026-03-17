import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any = null;

async function getApp() {
  if (app) return app;

  const { loadEnv } = await import('../packages/backend/src/config/env.js');
  const { buildApp } = await import('../packages/backend/src/app.js');

  const env = loadEnv();
  app = await buildApp(env);
  await app.ready();
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fastify = await getApp();

  const payload = req.body ? JSON.stringify(req.body) : undefined;
  const { 'content-length': _cl, 'transfer-encoding': _te, ...headers } = req.headers;

  const response = await fastify.inject({
    method: req.method,
    url: req.url,
    headers,
    payload,
  });

  res.status(response.statusCode);
  for (const [key, value] of Object.entries(response.headers)) {
    if (value !== undefined) {
      res.setHeader(key, value);
    }
  }
  res.send(response.body);
}
