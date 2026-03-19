import type { FastifyBaseLogger } from 'fastify';
import type { TokenRepository } from './token.repository.js';

export interface RuferProductResult {
  id: number;
  date_added: string;
  name: string;
  price: number;
  price_sale: number;
  description_small: string;
  description_full: string;
  image_default: string;
  url: string;
  status: boolean;
  categories_path: string;
  [key: string]: unknown;
}

export interface RuferApiResponse {
  status: number;
  totalFound: number;
  totalCount: number;
  result: RuferProductResult[];
}

export class RuferApiClient {
  constructor(
    private tokenRepository: TokenRepository,
    private config: { baseUrl: string; clientId: string; clientSecret: string },
    private logger: FastifyBaseLogger,
  ) {}

  private async authenticate(): Promise<string> {
    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`,
    ).toString('base64');

    const response = await fetch(`${this.config.baseUrl}/oauth`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (response.status === 403) {
      const body = await response.text();
      if (body.includes('Access token already been created')) {
        this.logger.info('Rufer token already exists, fetching from database');
        const existingToken = await this.tokenRepository.getToken();
        if (existingToken) return existingToken;
      }
      this.logger.error({ status: response.status, body }, 'Rufer authentication failed');
      throw new Error(`Rufer authentication failed: ${response.status}`);
    }

    if (!response.ok) {
      const body = await response.text();
      this.logger.error({ status: response.status, body }, 'Rufer authentication failed');
      throw new Error(`Rufer authentication failed: ${response.status}`);
    }

    const data = (await response.json()) as { access_token: string };
    await this.tokenRepository.saveToken(data.access_token);

    this.logger.info('Rufer API token obtained and saved');
    return data.access_token;
  }

  async getProduct(productId: number): Promise<RuferProductResult> {
    let token = await this.tokenRepository.getToken();

    if (!token) {
      token = await this.authenticate();
    }

    let response = await fetch(`${this.config.baseUrl}/product/${productId}`, {
      headers: { 'access-token': token },
    });

    if (response.status === 403) {
      this.logger.info('Rufer token expired (403), re-authenticating');
      token = await this.authenticate();
      response = await fetch(`${this.config.baseUrl}/product/${productId}`, {
        headers: { 'access-token': token },
      });
    }

    if (!response.ok) {
      const body = await response.text();
      this.logger.error({ status: response.status, body, productId }, 'Failed to fetch product from Rufer');
      throw new Error(`Failed to fetch product ${productId}: ${response.status}`);
    }

    const data = (await response.json()) as RuferApiResponse;

    if (!data.result?.length) {
      throw new Error(`Product ${productId} not found in Rufer API`);
    }

    return data.result[0];
  }
}
