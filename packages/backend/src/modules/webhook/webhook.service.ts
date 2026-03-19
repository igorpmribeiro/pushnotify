import type { SendNotificationInput } from '../notification/notification.schema.js';
import type { RuferProductResult } from './rufer-api.client.js';

export class WebhookService {
  transformProductToNotification(product: RuferProductResult): SendNotificationInput {
    const price = product.price_sale ?? product.price;
    const priceText = price > 0
      ? ` por R$ ${price.toFixed(2).replace('.', ',')}`
      : '';

    const description = product.description_small || product.description_full;

    return {
      title: 'Temos novidades em nossa loja',
      body: product.name,
      icon_url: product.image_default || undefined,
      target_url: product.url || undefined,
    };
  }
}
