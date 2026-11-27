import type { TicketBaiWsWebhookEvent } from './ticketbaiws-webhook.model.js';

type TicketBaiWsWebhookNotificationEnvironment = 'test' | 'real';

/**
 * Headers sent by TicketBaiWS when delivering a webhook.
 *
 * Header names are case-insensitive when read from a Headers object.
 *
 * The signature must be verified against the exact raw request body
 * before trusting or processing the notification.
 */
interface TicketBaiWsWebhookNotificationHeaders {
  readonly 'X-TbaiWs-Id': string;
  readonly 'X-TbaiWs-Environment': TicketBaiWsWebhookNotificationEnvironment;
  readonly 'X-TbaiWs-Topic': TicketBaiWsWebhookEvent;
  readonly 'X-Tbaiws-Hmac-Sha256'?: string;
}

/**
 * Fields shared by the documented webhook payloads.
 *
 * These fields are optional because the OpenAPI webhook schemas
 * do not declare required properties.
 */
interface TicketBaiWsWebhookNotificationBase {
  readonly codigo_webhook?: string;
  readonly nif?: string;
}

/**
 * Error returned by the AEAT for an SPFE operation.
 */
interface TicketBaiWsWebhookSpfeError {
  readonly codigo?: string;
  readonly descripcion?: string;
}

/**
 * Notification sent after a TicketBAI or Verifactu invoice
 * changes its processing status.
 *
 * The event is identified by the X-TbaiWs-Topic header.
 * Older payload examples do not contain an evento property.
 */
interface TicketBaiWsInvoiceStatusWebhookNotification extends TicketBaiWsWebhookNotificationBase {
  readonly evento?: 'cambio_estado';
  readonly serie?: string;
  readonly numero?: string;
  readonly fecha_emision?: string;
  readonly estado?: 'OK' | 'ERROR';
  readonly avisos?: string;
}

/**
 * Notification with the result of sending an issued invoice
 * to the AEAT public electronic invoicing solution (SPFE).
 */
interface TicketBaiWsSpfeSentWebhookNotification extends TicketBaiWsWebhookNotificationBase {
  readonly evento?: 'spfe_envio';
  readonly serie?: string;
  readonly numero?: string;
  readonly fecha_emision?: string;
  readonly nif_cliente?: string;
  readonly tipo?: string;
  readonly estado?: 'OK' | 'ERROR';
  readonly errores?: readonly TicketBaiWsWebhookSpfeError[];
  readonly localizador?: string;
}

/**
 * Notification with the processing result of a payment,
 * collection, rejection or non-payment reported to SPFE.
 */
interface TicketBaiWsSpfeStatusWebhookNotification extends TicketBaiWsWebhookNotificationBase {
  readonly evento?: 'spfe_estado';
  readonly id?: number;
  readonly estado?: 'pago' | 'cobro' | 'rechazo' | 'impago';
  readonly baja?: boolean;
  readonly factura?: string;
  readonly fecha_factura?: string;
  readonly nif_emisor?: string;
  readonly fecha?: string | null;
  readonly vencimiento?: string | null;
  readonly result?: 'PENDING' | 'OK' | 'ERROR';
  readonly errores?: readonly TicketBaiWsWebhookSpfeError[];
}

/**
 * Notification sent when a supplier invoice is received
 * through SPFE.
 *
 * The notification does not include the UBL document.
 */
interface TicketBaiWsSpfeReceivedWebhookNotification extends TicketBaiWsWebhookNotificationBase {
  readonly evento?: 'spfe_recibida';
  readonly id?: number;
  readonly factura?: string;
  readonly fecha_factura?: string;
  readonly tipo_factura?: string;
  readonly copia?: boolean;
  readonly nif_emisor?: string;
  readonly nombre_emisor?: string;
  readonly base?: number;
  readonly cuota?: number;
  readonly total?: number;
  readonly vencimiento?: string | null;
  readonly estado?: 'pendiente' | 'pagada' | 'rechazada';
  readonly localizador?: string;
  readonly fecha_descarga?: string | null;
}

/**
 * Associates each webhook topic with its corresponding JSON payload.
 *
 * The topic is provided by the X-TbaiWs-Topic header.
 */
interface TicketBaiWsWebhookNotificationByEvent {
  readonly cambio_estado: TicketBaiWsInvoiceStatusWebhookNotification;
  readonly spfe_envio: TicketBaiWsSpfeSentWebhookNotification;
  readonly spfe_estado: TicketBaiWsSpfeStatusWebhookNotification;
  readonly spfe_recibida: TicketBaiWsSpfeReceivedWebhookNotification;
}

type TicketBaiWsWebhookNotification =
  TicketBaiWsWebhookNotificationByEvent[TicketBaiWsWebhookEvent];

export type {
  TicketBaiWsInvoiceStatusWebhookNotification,
  TicketBaiWsSpfeReceivedWebhookNotification,
  TicketBaiWsSpfeSentWebhookNotification,
  TicketBaiWsSpfeStatusWebhookNotification,
  TicketBaiWsWebhookNotification,
  TicketBaiWsWebhookNotificationByEvent,
  TicketBaiWsWebhookNotificationEnvironment,
  TicketBaiWsWebhookNotificationHeaders,
  TicketBaiWsWebhookSpfeError,
};
