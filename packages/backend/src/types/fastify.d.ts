import type { Env } from '../config/env.js';

declare module 'fastify' {
  interface FastifyInstance {
    env: Env;
  }
}
