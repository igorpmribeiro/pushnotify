import { describe, it, expect } from 'vitest';
import { WebhookService } from './webhook.service.js';
import type { RuferProductResult } from './rufer-api.client.js';

function makeProduct(overrides: Partial<RuferProductResult> = {}): RuferProductResult {
  return {
    id: 202,
    date_added: '2026-03-03 16:03:15',
    name: 'Atributos no Card',
    price: 999.99,
    price_sale: 999.99,
    description_small: '',
    description_full: '',
    image_default: 'https://cdn.iset.io/assets/51888/produtos/202/imagem-teste.png',
    url: 'https://www.create4.us/atributos-no-card-p202',
    status: true,
    categories_path: 'Smartphones',
    ...overrides,
  };
}

describe('WebhookService', () => {
  const service = new WebhookService();

  it('should transform product with description_small', () => {
    const product = makeProduct({ description_small: 'Produto incrível com muitas funcionalidades' });
    const result = service.transformProductToNotification(product);

    expect(result.title).toBe('Novo produto: Atributos no Card');
    expect(result.body).toBe('Produto incrível com muitas funcionalidades por R$ 999,99');
    expect(result.icon_url).toBe('https://cdn.iset.io/assets/51888/produtos/202/imagem-teste.png');
    expect(result.target_url).toBe('https://www.create4.us/atributos-no-card-p202');
  });

  it('should fall back to description_full when description_small is empty', () => {
    const product = makeProduct({
      description_small: '',
      description_full: 'Descrição completa do produto',
    });
    const result = service.transformProductToNotification(product);

    expect(result.body).toBe('Descrição completa do produto por R$ 999,99');
  });

  it('should use generic body when both descriptions are empty', () => {
    const product = makeProduct({ description_small: '', description_full: '' });
    const result = service.transformProductToNotification(product);

    expect(result.body).toBe('Confira o novo produto disponível na loja por R$ 999,99!');
  });

  it('should use price_sale over price', () => {
    const product = makeProduct({ price: 1500, price_sale: 1200 });
    const result = service.transformProductToNotification(product);

    expect(result.body).toContain('R$ 1200,00');
  });

  it('should omit price text when price is 0', () => {
    const product = makeProduct({ price: 0, price_sale: 0 });
    const result = service.transformProductToNotification(product);

    expect(result.body).not.toContain('R$');
  });

  it('should truncate long descriptions to 200 chars', () => {
    const longDesc = 'A'.repeat(300);
    const product = makeProduct({ description_small: longDesc });
    const result = service.transformProductToNotification(product);

    expect(result.body.substring(0, 200)).toBe('A'.repeat(200));
    expect(result.body).toContain('R$ 999,99');
  });

  it('should set icon_url to undefined when image_default is empty', () => {
    const product = makeProduct({ image_default: '' });
    const result = service.transformProductToNotification(product);

    expect(result.icon_url).toBeUndefined();
  });

  it('should set target_url to undefined when url is empty', () => {
    const product = makeProduct({ url: '' });
    const result = service.transformProductToNotification(product);

    expect(result.target_url).toBeUndefined();
  });
});
