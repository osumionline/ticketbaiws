import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';
import type { TicketBaiWsInvoiceStatus } from './ticketbaiws-get-invoice-response.model.js';

interface TicketBaiWsInvoiceListItem {
  readonly status: TicketBaiWsInvoiceStatus;
  readonly serie: string;
  readonly numero: string;
  readonly fecha: string;
  readonly fecha_factura: string;
  readonly nif: string;
  readonly importe: number;
  readonly zuzendu: boolean;
  readonly [key: string]: unknown;
}

interface TicketBaiWsListInvoicesResponse extends TicketBaiWsSuccessResponse<
  readonly TicketBaiWsInvoiceListItem[]
> {
  readonly count: string;
}

export type { TicketBaiWsInvoiceListItem, TicketBaiWsListInvoicesResponse };
