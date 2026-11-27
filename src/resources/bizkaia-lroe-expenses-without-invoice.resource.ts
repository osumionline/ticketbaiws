import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsCancelLroeExpensesWithoutInvoiceRequest,
  TicketBaiWsListLroeExpensesWithoutInvoiceRequest,
  TicketBaiWsListLroeExpensesWithoutInvoiceResponse,
  TicketBaiWsListLroeExpensesWithoutInvoiceResult,
  TicketBaiWsLroeExpensesWithoutInvoiceMutationResponse,
  TicketBaiWsLroeExpensesWithoutInvoiceMutationResult,
  TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest,
} from '../model/bizkaia/ticketbaiws-lroe-expense-without-invoice.model.js';

class TicketBaiWsBizkaiaLroeExpensesWithoutInvoiceResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Creates expense records without invoices in Bizkaia LROE
   * model 140, section 2.2.
   *
   * Existing accepted expenses are not submitted again.
   *
   * @param data Fiscal year and expenses to submit.
   * @returns The batch processing response.
   */
  async create(
    data: TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest,
  ): Promise<TicketBaiWsLroeExpensesWithoutInvoiceMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeExpensesWithoutInvoiceMutationResult>(
      'POST',
      'lroe-gastos-sinfactura/',
      {
        json: data,
      },
    );
  }

  /**
   * Updates existing expenses without invoices.
   *
   * The identifying fields must remain unchanged.
   * All expense data must be submitted again.
   *
   * @param data Fiscal year and expenses to update.
   * @returns The batch processing response.
   */
  async update(
    data: TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest,
  ): Promise<TicketBaiWsLroeExpensesWithoutInvoiceMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeExpensesWithoutInvoiceMutationResult>(
      'PUT',
      'lroe-gastos-sinfactura/',
      {
        json: data,
      },
    );
  }

  /**
   * Lists expenses without invoices from Bizkaia LROE.
   *
   * Query parameters are sent through the URL.
   *
   * @param filters Fiscal year and optional query filters.
   * @returns The expense query response.
   */
  async list(
    filters: TicketBaiWsListLroeExpensesWithoutInvoiceRequest,
  ): Promise<TicketBaiWsListLroeExpensesWithoutInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsListLroeExpensesWithoutInvoiceResult>(
      'GET',
      'lroe-gastos-sinfactura/',
      {
        query: {
          ejercicio: filters.ejercicio,
          fecha_operacion_desde: filters.fecha_operacion_desde,
          fecha_operacion_hasta: filters.fecha_operacion_hasta,
          nif: filters.nif,
          pais: filters.pais,
          tipo_documento: filters.tipo_documento,
          epigrafe: filters.epigrafe,
          estado: filters.estado,
          pagina: filters.pagina,
        },
      },
    );
  }

  /**
   * Cancels expense records without invoices.
   *
   * Only the identifying fields are required.
   *
   * @param data Fiscal year and expense identifiers to cancel.
   * @returns The batch processing response.
   */
  async cancel(
    data: TicketBaiWsCancelLroeExpensesWithoutInvoiceRequest,
  ): Promise<TicketBaiWsLroeExpensesWithoutInvoiceMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeExpensesWithoutInvoiceMutationResult>(
      'DELETE',
      'lroe-gastos-sinfactura/',
      {
        json: data,
      },
    );
  }
}

export default TicketBaiWsBizkaiaLroeExpensesWithoutInvoiceResource;
