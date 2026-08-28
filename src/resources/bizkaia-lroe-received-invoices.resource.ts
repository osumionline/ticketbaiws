import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsCancelLroeReceivedInvoicesRequest,
  TicketBaiWsCreateLroeReceivedInvoicesRequest,
  TicketBaiWsListLroeReceivedInvoicesRequest,
  TicketBaiWsListLroeReceivedInvoicesResponse,
  TicketBaiWsListLroeReceivedInvoicesResult,
  TicketBaiWsLroeReceivedInvoicesMutationResponse,
  TicketBaiWsLroeReceivedInvoicesMutationResult,
  TicketBaiWsUpdateLroeReceivedInvoicesRequest,
} from '../model/bizkaia/ticketbaiws-lroe-received-invoice.model.js';

class TicketBaiWsBizkaiaLroeReceivedInvoicesResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Creates received-invoice records in the Bizkaia LROE.
   *
   * Multiple invoices can be submitted in a single batch.
   *
   * @param data Fiscal year and received invoices to submit.
   * @returns The batch processing response for the submitted invoices.
   */
  async create(
    data: TicketBaiWsCreateLroeReceivedInvoicesRequest,
  ): Promise<TicketBaiWsLroeReceivedInvoicesMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeReceivedInvoicesMutationResult>(
      'POST',
      'lroe-recibidas/',
      {
        json: data,
      },
    );
  }

  /**
   * Updates existing received-invoice records in the Bizkaia LROE.
   *
   * @param data Fiscal year and received invoices to update.
   * @returns The batch processing response for the updated invoices.
   */
  async update(
    data: TicketBaiWsUpdateLroeReceivedInvoicesRequest,
  ): Promise<TicketBaiWsLroeReceivedInvoicesMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeReceivedInvoicesMutationResult>(
      'PUT',
      'lroe-recibidas/',
      {
        json: data,
      },
    );
  }

  /**
   * Lists received-invoice records from the Bizkaia LROE.
   *
   * Monetary and tax values returned by TicketBaiWS may be represented
   * as strings even when their write models use numbers.
   *
   * @param filters Fiscal year and optional query filters.
   * @returns The received-invoice query response.
   */
  async list(
    filters: TicketBaiWsListLroeReceivedInvoicesRequest,
  ): Promise<TicketBaiWsListLroeReceivedInvoicesResponse> {
    return this.httpClient.request<TicketBaiWsListLroeReceivedInvoicesResult>(
      'GET',
      'lroe-recibidas/',
      {
        query: {
          ejercicio: filters.ejercicio,
          fecha_factura_desde: filters.fecha_factura_desde,
          fecha_factura_hasta: filters.fecha_factura_hasta,
          fecha_recepcion_desde: filters.fecha_recepcion_desde,
          fecha_recepcion_hasta: filters.fecha_recepcion_hasta,
          pais_emisor: filters.pais_emisor,
          tipo_documento: filters.tipo_documento,
          nif: filters.nif,
          num_factura: filters.num_factura,
          epigrafe: filters.epigrafe,
          estado: filters.estado,
          pagina: filters.pagina,
        },
      },
    );
  }

  /**
   * Cancels received-invoice records in the Bizkaia LROE.
   *
   * @param data Fiscal year and invoices to cancel.
   * @returns The batch processing response for the cancelled invoices.
   */
  async cancel(
    data: TicketBaiWsCancelLroeReceivedInvoicesRequest,
  ): Promise<TicketBaiWsLroeReceivedInvoicesMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeReceivedInvoicesMutationResult>(
      'DELETE',
      'lroe-recibidas/',
      {
        json: data,
      },
    );
  }
}

export default TicketBaiWsBizkaiaLroeReceivedInvoicesResource;
