import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type TicketBaiWsCompleteInvoiceRequest from '../model/invoice/ticketbaiws-complete-invoice-request.model.js';
import type { TicketBaiWsCompleteInvoiceResponse } from '../model/invoice/ticketbaiws-complete-invoice-response.model.js';
import type TicketBaiWsCreateInvoiceRequest from '../model/invoice/ticketbaiws-create-invoice-request.model.js';
import type {
  TicketBaiWsCreateInvoiceResponse,
  TicketBaiWsCreateInvoiceResult,
  TicketBaiWsTicketBaiInvoiceResult,
} from '../model/invoice/ticketbaiws-create-invoice-response.model.js';
import type {
  TicketBaiWsGetInvoiceResponse,
  TicketBaiWsGetInvoiceResult,
} from '../model/invoice/ticketbaiws-get-invoice-response.model.js';
import type {
  TicketBaiWsCancelInvoiceResponse,
  TicketBaiWsInvoiceActionResult,
  TicketBaiWsResendInvoiceResponse,
} from '../model/invoice/ticketbaiws-invoice-action-response.model.js';
import type {
  TicketBaiWsFacturaERequest,
  TicketBaiWsFacturaEResponse,
  TicketBaiWsInvoicePdfResponse,
  TicketBaiWsInvoiceXmlResponse,
  TicketBaiWsInvoiceXmlResult,
} from '../model/invoice/ticketbaiws-invoice-download.model.js';
import type {
  TicketBaiWsCancelInvoiceRequest,
  TicketBaiWsInvoiceReference,
} from '../model/invoice/ticketbaiws-invoice-reference.model.js';
import type TicketBaiWsListInvoicesRequest from '../model/invoice/ticketbaiws-list-invoices-request.model.js';
import type {
  TicketBaiWsInvoiceListItem,
  TicketBaiWsListInvoicesResponse,
} from '../model/invoice/ticketbaiws-list-invoices-response.model.js';

class TicketBaiWsInvoicesResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  async create(
    invoice: TicketBaiWsCreateInvoiceRequest,
  ): Promise<TicketBaiWsCreateInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsCreateInvoiceResult>(
      'POST',
      'tbai/',
      {
        json: invoice,
      },
    );
  }

  async completeSimplified(
    invoice: TicketBaiWsCompleteInvoiceRequest,
  ): Promise<TicketBaiWsCompleteInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsTicketBaiInvoiceResult>(
      'POST',
      'tbai-completar/',
      {
        json: invoice,
      },
    );
  }

  async get(
    invoice: TicketBaiWsInvoiceReference,
  ): Promise<TicketBaiWsGetInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsGetInvoiceResult>(
      'GET',
      'tbai/',
      {
        query: {
          serie: invoice.serie,
          numero: invoice.numero,
        },
      },
    );
  }

  async getXml(
    invoice: TicketBaiWsInvoiceReference,
  ): Promise<TicketBaiWsInvoiceXmlResponse> {
    return this.httpClient.request<TicketBaiWsInvoiceXmlResult>(
      'GET',
      'tbai-xml/',
      {
        query: {
          serie: invoice.serie,
          numero: invoice.numero,
        },
      },
    );
  }

  async getPdf(
    invoice: TicketBaiWsInvoiceReference,
  ): Promise<TicketBaiWsInvoicePdfResponse> {
    return this.httpClient.request<string>('GET', 'tbai-pdf/', {
      query: {
        serie: invoice.serie,
        numero: invoice.numero,
      },
    });
  }

  async getFacturaE(
    invoice: TicketBaiWsFacturaERequest,
  ): Promise<TicketBaiWsFacturaEResponse> {
    return this.httpClient.request<string>('GET', 'facturae/', {
      query: {
        serie: invoice.serie,
        numero: invoice.numero,
        cod_organo_gestor: invoice.cod_organo_gestor,
        cod_unidad_tramitadora: invoice.cod_unidad_tramitadora,
        cod_oficina_contable: invoice.cod_oficina_contable,
      },
    });
  }

  async list(
    filters: TicketBaiWsListInvoicesRequest,
  ): Promise<TicketBaiWsListInvoicesResponse> {
    const response = await this.httpClient.request<
      readonly TicketBaiWsInvoiceListItem[]
    >('GET', 'tbai-list/', {
      query: {
        fecha_inicio: filters.fecha_inicio,
        fecha_fin: filters.fecha_fin,
        serie: filters.serie,
        pagina: filters.pagina,
        json_orig: filters.json_orig,
        xml_request: filters.xml_request,
        pedido: filters.pedido,
      },
    });

    return response as TicketBaiWsListInvoicesResponse;
  }

  async cancel(
    invoice: TicketBaiWsCancelInvoiceRequest,
  ): Promise<TicketBaiWsCancelInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsInvoiceActionResult>(
      'DELETE',
      'tbai/',
      {
        json: invoice,
      },
    );
  }

  async resend(
    invoice: TicketBaiWsInvoiceReference,
  ): Promise<TicketBaiWsResendInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsInvoiceActionResult>(
      'PUT',
      'reset-tbai/',
      {
        json: invoice,
      },
    );
  }
}

export default TicketBaiWsInvoicesResource;
