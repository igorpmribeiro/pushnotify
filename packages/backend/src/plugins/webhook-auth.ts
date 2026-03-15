import { createHmac, timingSafeEqual } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export function createWebhookAuthHook(secret: string) {
  return async function webhookAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const signature = request.headers['x-webhook-signature'] as string | undefined;

    if (!signature) {
      reply.status(401).send({ error: 'UNAUTHORIZED', message: 'Missing webhook signature' });
      return;
    }

    const rawBody = JSON.stringify(request.body);
    const expectedSignature = createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
      reply.status(401).send({ error: 'UNAUTHORIZED', message: 'Invalid webhook signature' });
      return;
    }
  };
}
