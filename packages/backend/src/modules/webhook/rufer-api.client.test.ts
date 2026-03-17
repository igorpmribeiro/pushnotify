import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RuferApiClient, type RuferApiResponse } from './rufer-api.client.js';

const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
  child: vi.fn().mockReturnThis(),
  silent: vi.fn(),
  level: 'info',
} as any;

const mockTokenRepo = {
  getToken: vi.fn(),
  saveToken: vi.fn(),
};

const config = {
  baseUrl: 'https://api.example.com/ws/v1',
  clientId: '12345',
  clientSecret: 'secret123',
};

const sampleApiResponse: RuferApiResponse = {
  status: 200,
  totalFound: 1,
  totalCount: 1,
  result: [
    {
      id: 202,
      date_added: '2026-03-03 16:03:15',
      name: 'Test Product',
      price: 999.99,
      price_sale: 999.99,
      description_small: 'Short desc',
      description_full: 'Full desc',
      image_default: 'https://cdn.example.com/img.png',
      url: 'https://example.com/product-p202',
      status: true,
      categories_path: 'Category',
    },
  ],
};

function mockFetch(responses: Array<{ status: number; body: any; ok?: boolean }>) {
  let callIndex = 0;
  return vi.fn(async () => {
    const resp = responses[callIndex++];
    return {
      ok: resp.ok ?? (resp.status >= 200 && resp.status < 300),
      status: resp.status,
      json: async () => resp.body,
      text: async () => JSON.stringify(resp.body),
    };
  });
}

describe('RuferApiClient', () => {
  let client: RuferApiClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockTokenRepo.getToken.mockReset();
    mockTokenRepo.saveToken.mockReset();
    client = new RuferApiClient(mockTokenRepo as any, config, mockLogger);
  });

  describe('getProduct', () => {
    it('should fetch product using existing token', async () => {
      mockTokenRepo.getToken.mockResolvedValue('existing-token');

      const fetchMock = mockFetch([
        { status: 200, body: sampleApiResponse },
      ]);
      vi.stubGlobal('fetch', fetchMock);

      const product = await client.getProduct(202);

      expect(product.id).toBe(202);
      expect(product.name).toBe('Test Product');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.example.com/ws/v1/product/202',
        { headers: { 'access-token': 'existing-token' } },
      );
    });

    it('should authenticate when no token exists', async () => {
      mockTokenRepo.getToken.mockResolvedValue(null);

      const fetchMock = mockFetch([
        { status: 200, body: { access_token: 'new-token' } },
        { status: 200, body: sampleApiResponse },
      ]);
      vi.stubGlobal('fetch', fetchMock);

      const product = await client.getProduct(202);

      expect(product.name).toBe('Test Product');
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[0][0]).toBe('https://api.example.com/ws/v1/oauth');
      expect(mockTokenRepo.saveToken).toHaveBeenCalledWith('new-token');
    });

    it('should re-authenticate on 403 and retry', async () => {
      mockTokenRepo.getToken.mockResolvedValue('expired-token');

      const fetchMock = mockFetch([
        { status: 403, body: { error: 'Forbidden' }, ok: false },
        { status: 200, body: { access_token: 'refreshed-token' } },
        { status: 200, body: sampleApiResponse },
      ]);
      vi.stubGlobal('fetch', fetchMock);

      const product = await client.getProduct(202);

      expect(product.name).toBe('Test Product');
      expect(fetchMock).toHaveBeenCalledTimes(3);

      // 1st call: product fetch with expired token
      expect(fetchMock.mock.calls[0][0]).toContain('/product/202');
      // 2nd call: oauth
      expect(fetchMock.mock.calls[1][0]).toContain('/oauth');
      // 3rd call: product fetch with new token
      expect(fetchMock.mock.calls[2][1]).toEqual({
        headers: { 'access-token': 'refreshed-token' },
      });
    });

    it('should throw when product not found in result', async () => {
      mockTokenRepo.getToken.mockResolvedValue('valid-token');

      const emptyResponse: RuferApiResponse = {
        status: 200,
        totalFound: 0,
        totalCount: 0,
        result: [],
      };

      const fetchMock = mockFetch([
        { status: 200, body: emptyResponse },
      ]);
      vi.stubGlobal('fetch', fetchMock);

      await expect(client.getProduct(999)).rejects.toThrow(
        'Product 999 not found in Rufer API',
      );
    });

    it('should throw when API returns non-ok status after retry', async () => {
      mockTokenRepo.getToken.mockResolvedValue('valid-token');

      const fetchMock = mockFetch([
        { status: 500, body: 'Internal Server Error', ok: false },
      ]);
      vi.stubGlobal('fetch', fetchMock);

      await expect(client.getProduct(202)).rejects.toThrow(
        'Failed to fetch product 202: 500',
      );
    });

    it('should throw when authentication fails', async () => {
      mockTokenRepo.getToken.mockResolvedValue(null);

      const fetchMock = mockFetch([
        { status: 401, body: 'Unauthorized', ok: false },
      ]);
      vi.stubGlobal('fetch', fetchMock);

      await expect(client.getProduct(202)).rejects.toThrow(
        'Rufer authentication failed: 401',
      );
    });

    it('should encode credentials as base64 for auth', async () => {
      mockTokenRepo.getToken.mockResolvedValue(null);

      const expectedBase64 = Buffer.from('12345:secret123').toString('base64');

      const fetchMock = mockFetch([
        { status: 200, body: { access_token: 'token' } },
        { status: 200, body: sampleApiResponse },
      ]);
      vi.stubGlobal('fetch', fetchMock);

      await client.getProduct(202);

      expect(fetchMock.mock.calls[0][1]).toEqual({
        method: 'POST',
        headers: { Authorization: `Basic ${expectedBase64}` },
      });
    });
  });
});
