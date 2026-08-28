import type { TicketBaiWsNonErrorResponse } from '../common/ticketbaiws-response.model.js';

interface TicketBaiWsTicketBaiInvoiceResult {
  readonly huella_tbai: string;
  readonly qr: string;
  readonly url: string;
}

interface TicketBaiWsVerifactuInvoiceResult {
  readonly huella: string;
  readonly qr: string;
  readonly url: string;
}

type TicketBaiWsCreateInvoiceResult =
  | TicketBaiWsTicketBaiInvoiceResult
  | TicketBaiWsVerifactuInvoiceResult;

type TicketBaiWsCreateInvoiceResponse =
  TicketBaiWsNonErrorResponse<TicketBaiWsCreateInvoiceResult>;

export type {
  TicketBaiWsCreateInvoiceResponse,
  TicketBaiWsCreateInvoiceResult,
  TicketBaiWsTicketBaiInvoiceResult,
  TicketBaiWsVerifactuInvoiceResult,
};
