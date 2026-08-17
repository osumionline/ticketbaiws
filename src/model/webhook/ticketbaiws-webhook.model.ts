import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

interface TicketBaiWsWebhookRequest {
  readonly url: string;
  readonly secret: string;
  readonly solo_errores?: boolean;
  readonly activo?: boolean;
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
}

interface TicketBaiWsListWebhooksRequest {
  readonly solo_errores?: boolean;
  readonly activo?: boolean;
}

type TicketBaiWsWebhookResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsWebhook>;

type TicketBaiWsGetWebhookResult =
  | TicketBaiWsWebhook
  | readonly TicketBaiWsWebhook[];

type TicketBaiWsGetWebhookResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsGetWebhookResult>;

type TicketBaiWsListWebhooksResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsWebhook[]
>;

export type {
  TicketBaiWsGetWebhookResponse,
  TicketBaiWsGetWebhookResult,
  TicketBaiWsListWebhooksRequest,
  TicketBaiWsListWebhooksResponse,
  TicketBaiWsWebhook,
  TicketBaiWsWebhookRequest,
  TicketBaiWsWebhookResponse,
};
