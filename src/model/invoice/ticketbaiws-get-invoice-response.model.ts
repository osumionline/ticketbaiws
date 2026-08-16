import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';
import type {
  TicketBaiWsTicketBaiInvoiceResult,
  TicketBaiWsVerifactuInvoiceResult,
} from './ticketbaiws-create-invoice-response.model.js';

type TicketBaiWsInvoiceStatus = 'OK' | 'PENDING' | 'ERROR';

interface TicketBaiWsTicketBaiInvoiceStatusResult extends TicketBaiWsTicketBaiInvoiceResult {
  readonly status: TicketBaiWsInvoiceStatus;
}

interface TicketBaiWsVerifactuInvoiceStatusResult extends TicketBaiWsVerifactuInvoiceResult {
  readonly status: TicketBaiWsInvoiceStatus;
}

type TicketBaiWsGetInvoiceResult =
  | TicketBaiWsTicketBaiInvoiceStatusResult
  | TicketBaiWsVerifactuInvoiceStatusResult;

type TicketBaiWsGetInvoiceResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsGetInvoiceResult>;

export type {
  TicketBaiWsGetInvoiceResponse,
  TicketBaiWsGetInvoiceResult,
  TicketBaiWsInvoiceStatus,
  TicketBaiWsTicketBaiInvoiceStatusResult,
  TicketBaiWsVerifactuInvoiceStatusResult,
};
