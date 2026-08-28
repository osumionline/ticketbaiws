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

  /**
   * Creates a TicketBAI or Verifactu invoice.
   *
   * TicketBaiWS processes invoice submissions asynchronously by default,
   * so a valid response may have a result of `OK` or `PENDING`.
   *
   * When available, the response includes the fiscal fingerprint,
   * QR code and verification URL even if processing is still pending.
   *
   * @param invoice Invoice data to submit.
   * @returns The TicketBaiWS invoice creation response.
   */
  async create(
    invoice: TicketBaiWsCreateInvoiceRequest,
  ): Promise<TicketBaiWsCreateInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsCreateInvoiceResult>(
      'POST',
      'tbai/',
      {
        json: invoice,
        allowPending: true,
      },
    );
  }

  /**
   * Completes one or more simplified invoices with customer information.
   *
   * @param invoice Data for the resulting complete invoice and the
   * simplified invoices it replaces.
   * @returns The TicketBaiWS response for the completed invoice.
   */
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

  /**
   * Gets the current processing status and fiscal information of an invoice.
   *
   * @param invoice Series and number identifying the invoice.
   * @returns The TicketBaiWS invoice status response.
   */
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

  /**
   * Gets the request and response XML associated with an invoice.
   *
   * @param invoice Series and number identifying the invoice.
   * @returns The XML documents associated with the invoice.
   */
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

  /**
   * Gets the PDF representation of an invoice.
   *
   * The PDF is returned by TicketBaiWS as a Base64-encoded string.
   *
   * @param invoice Series and number identifying the invoice.
   * @returns The TicketBaiWS response containing the Base64-encoded PDF.
   */
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

  /**
   * Gets the FacturaE document associated with an invoice.
   *
   * The generated document is returned by TicketBaiWS as a
   * Base64-encoded string.
   *
   * @param invoice Invoice reference and optional DIR3 codes.
   * @returns The TicketBaiWS response containing the Base64-encoded
   * FacturaE document.
   */
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

  /**
   * Lists invoices matching the provided filters.
   *
   * Results are paginated by TicketBaiWS.
   *
   * @param filters Date range and optional filters used to query invoices.
   * @returns The paginated TicketBaiWS invoice list response.
   */
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

  /**
   * Cancels an existing invoice.
   *
   * @param invoice Data identifying the invoice to cancel.
   * @returns The TicketBaiWS cancellation response.
   */
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

  /**
   * Requests TicketBaiWS to resend an existing invoice.
   *
   * This operation requeues the stored invoice for processing without
   * recreating or modifying its fiscal data.
   *
   * @param invoice Series and number identifying the invoice.
   * @returns The TicketBaiWS resend response.
   */
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
