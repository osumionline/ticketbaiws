import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsCancelLroeCashPaymentsRequest,
  TicketBaiWsListLroeCashPaymentsRequest,
  TicketBaiWsListLroeCashPaymentsResponse,
  TicketBaiWsListLroeCashPaymentsResult,
  TicketBaiWsLroeCashPaymentsMutationResponse,
  TicketBaiWsLroeCashPaymentsMutationResult,
  TicketBaiWsMutateLroeCashPaymentsRequest,
} from '../model/bizkaia/ticketbaiws-lroe-cash-payment.model.js';

class TicketBaiWsBizkaiaLroeCashPaymentsResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Creates cash-payment records in the Bizkaia LROE.
   *
   * The batch may contain operations with or without an associated
   * invoice.
   *
   * @param data Fiscal year and cash payments to submit.
   * @returns The batch processing response for the submitted payments.
   */
  async create(
    data: TicketBaiWsMutateLroeCashPaymentsRequest,
  ): Promise<TicketBaiWsLroeCashPaymentsMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeCashPaymentsMutationResult>(
      'POST',
      'lroe-critcaja-pagos/',
      {
        json: data,
      },
    );
  }

  /**
   * Updates cash-payment records in the Bizkaia LROE.
   *
   * @param data Fiscal year and cash payments to update.
   * @returns The batch processing response for the updated payments.
   */
  async update(
    data: TicketBaiWsMutateLroeCashPaymentsRequest,
  ): Promise<TicketBaiWsLroeCashPaymentsMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeCashPaymentsMutationResult>(
      'PUT',
      'lroe-critcaja-pagos/',
      {
        json: data,
      },
    );
  }

  /**
   * Lists cash-payment records from the Bizkaia LROE.
   *
   * Monetary values returned by TicketBaiWS may be represented as
   * strings even when their write models use numbers.
   *
   * @param filters Fiscal year and optional query filters.
   * @returns The cash-payment query response.
   */
  async list(
    filters: TicketBaiWsListLroeCashPaymentsRequest,
  ): Promise<TicketBaiWsListLroeCashPaymentsResponse> {
    return this.httpClient.request<TicketBaiWsListLroeCashPaymentsResult>(
      'GET',
      'lroe-critcaja-pagos/',
      {
        query: {
          ejercicio: filters.ejercicio,
          fecha_factura_desde: filters.fecha_factura_desde,
          fecha_factura_hasta: filters.fecha_factura_hasta,
          fecha_operacion_desde: filters.fecha_operacion_desde,
          fecha_operacion_hasta: filters.fecha_operacion_hasta,
          fecha_pago_desde: filters.fecha_pago_desde,
          fecha_pago_hasta: filters.fecha_pago_hasta,
          concepto: filters.concepto,
          num_factura: filters.num_factura,
          epigrafe: filters.epigrafe,
          estado: filters.estado,
          pagina: filters.pagina,
        },
      },
    );
  }

  /**
   * Cancels cash-payment records in the Bizkaia LROE.
   *
   * @param data Fiscal year and cash payments to cancel.
   * @returns The batch processing response for the cancelled payments.
   */
  async cancel(
    data: TicketBaiWsCancelLroeCashPaymentsRequest,
  ): Promise<TicketBaiWsLroeCashPaymentsMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeCashPaymentsMutationResult>(
      'DELETE',
      'lroe-critcaja-pagos/',
      {
        json: data,
      },
    );
  }
}

export default TicketBaiWsBizkaiaLroeCashPaymentsResource;
