import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsCancelLroeCashCollectionsRequest,
  TicketBaiWsListLroeCashCollectionsRequest,
  TicketBaiWsListLroeCashCollectionsResponse,
  TicketBaiWsListLroeCashCollectionsResult,
  TicketBaiWsLroeCashCollectionsMutationResponse,
  TicketBaiWsLroeCashCollectionsMutationResult,
  TicketBaiWsMutateLroeCashCollectionsRequest,
} from '../model/bizkaia/ticketbaiws-lroe-cash-collection.model.js';

class TicketBaiWsBizkaiaLroeCashCollectionsResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  async create(
    data: TicketBaiWsMutateLroeCashCollectionsRequest,
  ): Promise<TicketBaiWsLroeCashCollectionsMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeCashCollectionsMutationResult>(
      'POST',
      'lroe-critcaja-cobros/',
      {
        json: data,
      },
    );
  }

  async update(
    data: TicketBaiWsMutateLroeCashCollectionsRequest,
  ): Promise<TicketBaiWsLroeCashCollectionsMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeCashCollectionsMutationResult>(
      'PUT',
      'lroe-critcaja-cobros/',
      {
        json: data,
      },
    );
  }

  async list(
    filters: TicketBaiWsListLroeCashCollectionsRequest,
  ): Promise<TicketBaiWsListLroeCashCollectionsResponse> {
    return this.httpClient.request<TicketBaiWsListLroeCashCollectionsResult>(
      'GET',
      'lroe-critcaja-cobros/',
      {
        query: {
          ejercicio: filters.ejercicio,
          fecha_factura_desde: filters.fecha_factura_desde,
          fecha_factura_hasta: filters.fecha_factura_hasta,
          fecha_operacion_desde: filters.fecha_operacion_desde,
          fecha_operacion_hasta: filters.fecha_operacion_hasta,
          fecha_cobro_desde: filters.fecha_cobro_desde,
          fecha_cobro_hasta: filters.fecha_cobro_hasta,
          tipo_ingreso: filters.tipo_ingreso,
          num_factura: filters.num_factura,
          epigrafe: filters.epigrafe,
          estado: filters.estado,
          pagina: filters.pagina,
        },
      },
    );
  }

  async cancel(
    data: TicketBaiWsCancelLroeCashCollectionsRequest,
  ): Promise<TicketBaiWsLroeCashCollectionsMutationResponse> {
    return this.httpClient.request<TicketBaiWsLroeCashCollectionsMutationResult>(
      'DELETE',
      'lroe-critcaja-cobros/',
      {
        json: data,
      },
    );
  }
}

export default TicketBaiWsBizkaiaLroeCashCollectionsResource;
