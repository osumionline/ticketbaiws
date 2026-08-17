import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsCreateLroeReceivedInvoicesRequest,
  TicketBaiWsLroeReceivedInvoicesMutationResponse,
  TicketBaiWsLroeReceivedInvoicesMutationResult,
  TicketBaiWsUpdateLroeReceivedInvoicesRequest,
  TicketBaiWsCancelLroeReceivedInvoicesRequest,
  TicketBaiWsListLroeReceivedInvoicesRequest,
  TicketBaiWsListLroeReceivedInvoicesResponse,
  TicketBaiWsListLroeReceivedInvoicesResult,
} from '../model/bizkaia/ticketbaiws-lroe-received-invoice.model.js';

class TicketBaiWsBizkaiaLroeReceivedInvoicesResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

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
