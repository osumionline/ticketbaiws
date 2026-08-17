import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsGetWebhookResponse,
  TicketBaiWsGetWebhookResult,
  TicketBaiWsListWebhooksRequest,
  TicketBaiWsListWebhooksResponse,
  TicketBaiWsWebhook,
  TicketBaiWsWebhookRequest,
  TicketBaiWsWebhookResponse,
} from '../model/webhook/ticketbaiws-webhook.model.js';

class TicketBaiWsWebhooksResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  async create(
    webhook: TicketBaiWsWebhookRequest,
  ): Promise<TicketBaiWsWebhookResponse> {
    return this.httpClient.request<TicketBaiWsWebhook>('POST', 'webhooks/', {
      json: webhook,
    });
  }

  async update(
    code: string,
    webhook: TicketBaiWsWebhookRequest,
  ): Promise<TicketBaiWsWebhookResponse> {
    return this.httpClient.request<TicketBaiWsWebhook>(
      'PUT',
      `webhooks/${encodeURIComponent(code)}/`,
      {
        json: webhook,
      },
    );
  }

  async get(code: string): Promise<TicketBaiWsGetWebhookResponse> {
    return this.httpClient.request<TicketBaiWsGetWebhookResult>(
      'GET',
      `webhooks/${encodeURIComponent(code)}/`,
    );
  }

  async list(
    filters: TicketBaiWsListWebhooksRequest = {},
  ): Promise<TicketBaiWsListWebhooksResponse> {
    return this.httpClient.request<readonly TicketBaiWsWebhook[]>(
      'GET',
      'webhooks/',
      {
        query: {
          solo_errores: filters.solo_errores,
          activo: filters.activo,
        },
      },
    );
  }
}

export default TicketBaiWsWebhooksResource;
