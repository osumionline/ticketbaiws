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
