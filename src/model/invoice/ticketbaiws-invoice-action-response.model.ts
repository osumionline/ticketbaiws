import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

type TicketBaiWsInvoiceActionResult = Readonly<Record<string, unknown>>;

type TicketBaiWsCancelInvoiceResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsInvoiceActionResult>;

type TicketBaiWsResendInvoiceResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsInvoiceActionResult>;

export type {
  TicketBaiWsCancelInvoiceResponse,
  TicketBaiWsInvoiceActionResult,
  TicketBaiWsResendInvoiceResponse,
};
