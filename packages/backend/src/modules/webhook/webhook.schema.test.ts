import { describe, it, expect } from 'vitest';
import { productChangedWebhookSchema } from './webhook.schema.js';

describe('productChangedWebhookSchema', () => {
  it('should accept a valid payload', () => {
    const result = productChangedWebhookSchema.safeParse({
      product_id: 210,
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      product_id: 210,
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });
  });

  it('should accept payload with non-empty sku', () => {
    const result = productChangedWebhookSchema.safeParse({
      product_id: 1,
      sku: 'SKU-123',
      type: 'product-changed',
      domain: 'example.com',
    });

    expect(result.success).toBe(true);
  });

  it('should reject missing product_id', () => {
    const result = productChangedWebhookSchema.safeParse({
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });

    expect(result.success).toBe(false);
  });

  it('should reject negative product_id', () => {
    const result = productChangedWebhookSchema.safeParse({
      product_id: -1,
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });

    expect(result.success).toBe(false);
  });

  it('should reject non-integer product_id', () => {
    const result = productChangedWebhookSchema.safeParse({
      product_id: 1.5,
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });

    expect(result.success).toBe(false);
  });

  it('should reject string product_id', () => {
    const result = productChangedWebhookSchema.safeParse({
      product_id: '210',
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });

    expect(result.success).toBe(false);
  });

  it('should reject empty body', () => {
    const result = productChangedWebhookSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
