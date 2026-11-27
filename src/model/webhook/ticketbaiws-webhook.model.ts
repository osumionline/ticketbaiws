import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

/**
 * Events supported by TicketBaiWS webhook subscriptions.
 */
type TicketBaiWsWebhookEvent =
  | 'cambio_estado'
  | 'spfe_envio'
  | 'spfe_estado'
  | 'spfe_recibida';

interface TicketBaiWsWebhookRequest {
  readonly url: string;
  readonly secret: string;
  readonly solo_errores?: boolean;
  readonly activo?: boolean;

  /**
   * Events to subscribe to.
   *
   * When creating a webhook, TicketBaiWS defaults to
   * ['cambio_estado'] if this field is omitted.
   *
   * When updating a webhook, omitting this field preserves
   * the existing subscriptions.
   */
  readonly eventos?: readonly TicketBaiWsWebhookEvent[];
}

interface TicketBaiWsWebhook {
  readonly codigo: string;
  readonly url: string;
  readonly entorno: string;
  readonly secret: string;
  readonly solo_errores: boolean;
  readonly activo: boolean;
  readonly fecha_creado: string;
  readonly fecha_modificado: string;
  readonly nif?: string;

  /**
   * Events subscribed to by this webhook.
   *
   * Optional for compatibility with older API responses.
   */
  readonly eventos?: readonly TicketBaiWsWebhookEvent[];
}

interface TicketBaiWsListWebhooksRequest {
  readonly solo_errores?: boolean;
  readonly activo?: boolean;
}

type TicketBaiWsWebhookResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsWebhook>;

type TicketBaiWsGetWebhookResult = TicketBaiWsWebhook;

type TicketBaiWsGetWebhookResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsGetWebhookResult>;

/**
 * Response returned after deleting a webhook configuration.
 *
 * The documented successful response contains an empty array.
 */
type TicketBaiWsDeleteWebhookResponse = TicketBaiWsSuccessResponse<
  readonly unknown[]
>;

type TicketBaiWsListWebhooksResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsWebhook[]
>;

export type {
  TicketBaiWsDeleteWebhookResponse,
  TicketBaiWsGetWebhookResponse,
  TicketBaiWsGetWebhookResult,
  TicketBaiWsListWebhooksRequest,
  TicketBaiWsListWebhooksResponse,
  TicketBaiWsWebhook,
  TicketBaiWsWebhookEvent,
  TicketBaiWsWebhookRequest,
  TicketBaiWsWebhookResponse,
};
