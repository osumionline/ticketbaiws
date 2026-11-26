import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';
import type { TicketBaiWsInvoiceReference } from './ticketbaiws-invoice-reference.model.js';

interface TicketBaiWsFacturaERequest extends TicketBaiWsInvoiceReference {
  readonly cod_organo_gestor?: string;
  readonly cod_unidad_tramitadora?: string;
  readonly cod_oficina_contable?: string;
}

interface TicketBaiWsInvoiceXmlResult {
  readonly serie?: string;
  readonly numero?: string;
  readonly xml_request: string;
  readonly xml_response: string | null;
  readonly zuzendu?: number;
}

type TicketBaiWsInvoiceXmlData =
  | TicketBaiWsInvoiceXmlResult
  | readonly TicketBaiWsInvoiceXmlResult[];

type TicketBaiWsInvoiceXmlResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsInvoiceXmlData>;

type TicketBaiWsInvoicePdfResponse = TicketBaiWsSuccessResponse<string>;

type TicketBaiWsFacturaEResponse = TicketBaiWsSuccessResponse<string>;

export type {
  TicketBaiWsFacturaERequest,
  TicketBaiWsFacturaEResponse,
  TicketBaiWsInvoicePdfResponse,
  TicketBaiWsInvoiceXmlData,
  TicketBaiWsInvoiceXmlResponse,
  TicketBaiWsInvoiceXmlResult,
};
