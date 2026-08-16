import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';
import type { TicketBaiWsTicketBaiInvoiceResult } from './ticketbaiws-create-invoice-response.model.js';

type TicketBaiWsCompleteInvoiceResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsTicketBaiInvoiceResult>;

export type { TicketBaiWsCompleteInvoiceResponse };
