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

  /**
   * Creates a TicketBaiWS webhook configuration.
   *
   * @param webhook Webhook URL, secret and notification settings.
   * @returns The created webhook response.
   */
  async create(
    webhook: TicketBaiWsWebhookRequest,
  ): Promise<TicketBaiWsWebhookResponse> {
    return this.httpClient.request<TicketBaiWsWebhook>('POST', 'webhooks/', {
      json: webhook,
    });
  }

  /**
   * Updates an existing TicketBaiWS webhook.
   *
   * @param code Webhook code identifying the configuration to update.
   * @param webhook Updated webhook configuration.
   * @returns The updated webhook response.
   */
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

  /**
   * Gets a single webhook configuration by its code.
   *
   * Unlike list(), which returns an array, this method returns
   * one webhook configuration.
   *
   * @param code Webhook code identifying the configuration.
   * @returns The individual webhook configuration response.
   */
  async get(code: string): Promise<TicketBaiWsGetWebhookResponse> {
    return this.httpClient.request<TicketBaiWsGetWebhookResult>(
      'GET',
      `webhooks/${encodeURIComponent(code)}/`,
    );
  }

  /**
   * Lists webhook configurations available to the current account.
   *
   * @param filters Optional filters for active or error-only webhooks.
   * @returns The webhook list response.
   */
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
