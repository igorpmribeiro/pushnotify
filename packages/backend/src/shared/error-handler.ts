import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from './errors.js';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  request.log.error({ err: error }, 'Request error');

  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      error: error.code,
      message: error.message,
    });
    return;
  }

  if (error.validation) {
    reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: error.validation,
    });
    return;
  }

  reply.status(500).send({
    error: 'INTERNAL_ERROR',
    message: error.message || 'An unexpected error occurred',
  });
}
