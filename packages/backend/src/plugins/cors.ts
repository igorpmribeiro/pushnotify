import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

export async function registerCors(app: FastifyInstance, origin: string): Promise<void> {
  await app.register(cors, {
    origin: origin === '*' ? true : origin.split(','),
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Webhook-Signature'],
  });
}
