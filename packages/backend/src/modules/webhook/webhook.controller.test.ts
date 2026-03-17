import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebhookController } from './webhook.controller.js';
import type { RuferProductResult } from './rufer-api.client.js';

const mockNotificationService = {
  broadcastToAll: vi.fn(),
};

const mockRuferApiClient = {
  getProduct: vi.fn(),
};

const mockNotifiedProductRepo = {
  exists: vi.fn(),
  markNotified: vi.fn(),
};

function makeRequest(body: unknown) {
  return {
    body,
    log: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    },
  } as any;
}

function makeReply() {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return reply as any;
}

function todayDateStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d} 12:00:00`;
}

const sampleProduct: RuferProductResult = {
  id: 210,
  date_added: todayDateStr(),
  name: 'Produto Teste',
  price: 99.99,
  price_sale: 89.99,
  description_small: 'Descrição curta',
  description_full: 'Descrição completa',
  image_default: 'https://cdn.example.com/img.png',
  url: 'https://example.com/produto-p210',
  status: true,
  categories_path: 'Categoria',
};

describe('WebhookController', () => {
  let controller: WebhookController;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockNotificationService.broadcastToAll.mockReset();
    mockRuferApiClient.getProduct.mockReset();
    mockNotifiedProductRepo.exists.mockReset();
    mockNotifiedProductRepo.markNotified.mockReset();

    controller = new WebhookController(
      mockNotificationService as any,
      mockRuferApiClient as any,
      mockNotifiedProductRepo as any,
    );
  });

  it('should process new product and send notification', async () => {
    mockNotifiedProductRepo.exists.mockResolvedValue(false);
    mockRuferApiClient.getProduct.mockResolvedValue(sampleProduct);
    mockNotificationService.broadcastToAll.mockResolvedValue('notif-123');

    const request = makeRequest({
      product_id: 210,
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });
    const reply = makeReply();

    await controller.handleProductChanged(request, reply);

    expect(mockRuferApiClient.getProduct).toHaveBeenCalledWith(210);
    expect(mockNotificationService.broadcastToAll).toHaveBeenCalledWith({
      title: 'Novo produto: Produto Teste',
      body: 'Descrição curta por R$ 89,99',
      icon_url: 'https://cdn.example.com/img.png',
      target_url: 'https://example.com/produto-p210',
    });
    expect(mockNotifiedProductRepo.markNotified).toHaveBeenCalledWith(210, 'Produto Teste');
    expect(reply.status).toHaveBeenCalledWith(202);
    expect(reply.send).toHaveBeenCalledWith({
      message: 'Notification queued',
      notificationId: 'notif-123',
    });
  });

  it('should skip already notified products', async () => {
    mockNotifiedProductRepo.exists.mockResolvedValue(true);

    const request = makeRequest({
      product_id: 210,
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });
    const reply = makeReply();

    await controller.handleProductChanged(request, reply);

    expect(mockRuferApiClient.getProduct).not.toHaveBeenCalled();
    expect(mockNotificationService.broadcastToAll).not.toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: 'Product already notified, skipped',
    });
  });

  it('should skip products with date_added not today', async () => {
    mockNotifiedProductRepo.exists.mockResolvedValue(false);
    mockRuferApiClient.getProduct.mockResolvedValue({
      ...sampleProduct,
      date_added: '2020-01-15 10:00:00',
    });

    const request = makeRequest({
      product_id: 210,
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });
    const reply = makeReply();

    await controller.handleProductChanged(request, reply);

    expect(mockNotificationService.broadcastToAll).not.toHaveBeenCalled();
    expect(mockNotifiedProductRepo.markNotified).not.toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: 'Product is not new, skipped',
    });
  });

  it('should throw ValidationError for invalid payload', async () => {
    const request = makeRequest({ invalid: 'data' });
    const reply = makeReply();

    await expect(
      controller.handleProductChanged(request, reply),
    ).rejects.toThrow();
  });

  it('should throw ValidationError for missing product_id', async () => {
    const request = makeRequest({
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });
    const reply = makeReply();

    await expect(
      controller.handleProductChanged(request, reply),
    ).rejects.toThrow();
  });

  it('should propagate errors from rufer API', async () => {
    mockNotifiedProductRepo.exists.mockResolvedValue(false);
    mockRuferApiClient.getProduct.mockRejectedValue(new Error('API failure'));

    const request = makeRequest({
      product_id: 210,
      sku: '',
      type: 'product-changed',
      domain: 'www.create4.us',
    });
    const reply = makeReply();

    await expect(
      controller.handleProductChanged(request, reply),
    ).rejects.toThrow('API failure');
  });
});
