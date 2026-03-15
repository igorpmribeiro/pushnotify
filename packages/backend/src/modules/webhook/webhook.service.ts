import type { SendNotificationInput } from '../notification/notification.schema.js';
import type { ProductWebhookInput } from './webhook.schema.js';

export class WebhookService {
  transformProductToNotification(product: ProductWebhookInput): SendNotificationInput {
    const priceText = product.price
      ? ` por R$ ${product.price.toFixed(2).replace('.', ',')}`
      : '';

    return {
      title: `Novo produto: ${product.name}`,
      body: product.description
        ? `${product.description.slice(0, 200)}${priceText}`
        : `Confira o novo produto disponível na loja${priceText}!`,
      icon_url: product.image_url,
      target_url: product.url,
    };
  }
}
