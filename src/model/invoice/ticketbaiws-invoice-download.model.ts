import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';
import type { TicketBaiWsInvoiceReference } from './ticketbaiws-invoice-reference.model.js';

interface TicketBaiWsFacturaERequest extends TicketBaiWsInvoiceReference {
  readonly cod_organo_gestor?: string;
  readonly cod_unidad_tramitadora?: string;
  readonly cod_oficina_contable?: string;
}

interface TicketBaiWsInvoiceXmlResult {
  readonly xml_request: string;
  readonly xml_response: string;
}

type TicketBaiWsInvoiceXmlResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsInvoiceXmlResult>;

type TicketBaiWsInvoicePdfResponse = TicketBaiWsSuccessResponse<string>;

type TicketBaiWsFacturaEResponse = TicketBaiWsSuccessResponse<string>;

export type {
  TicketBaiWsFacturaERequest,
  TicketBaiWsFacturaEResponse,
  TicketBaiWsInvoicePdfResponse,
  TicketBaiWsInvoiceXmlResponse,
  TicketBaiWsInvoiceXmlResult,
};
