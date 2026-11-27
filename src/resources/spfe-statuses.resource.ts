import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsListSpfeStatusesRequest,
  TicketBaiWsListSpfeStatusesResponse,
  TicketBaiWsSpfeStatusRecord,
  TicketBaiWsSpfeStatusRequest,
  TicketBaiWsSpfeStatusResponse,
} from '../model/spfe/ticketbaiws-spfe-status.model.js';

class TicketBaiWsSpfeStatusesResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Reports a payment, collection, rejection or non-payment
   * to the AEAT public electronic invoicing solution (SPFE).
   *
   * Processing is asynchronous by default, so TicketBaiWS
   * may return OK or PENDING.
   *
   * Send baja: true to cancel a previously reported status.
   *
   * @param data Status data to report.
   * @returns The SPFE status submission response.
   */
  async create(
    data: TicketBaiWsSpfeStatusRequest,
  ): Promise<TicketBaiWsSpfeStatusResponse> {
    return this.httpClient.request<TicketBaiWsSpfeStatusRecord>(
      'POST',
      'spfe-estados/',
      {
        json: data,
        allowPending: true,
      },
    );
  }

  /**
   * Lists reported SPFE statuses.
   *
   * TicketBaiWS returns up to the latest 100 status records.
   * All filters are optional and can be combined.
   *
   * @param filters Optional status query filters.
   * @returns The matching SPFE status records.
   */
  async list(
    filters: TicketBaiWsListSpfeStatusesRequest = {},
  ): Promise<TicketBaiWsListSpfeStatusesResponse> {
    return this.httpClient.request<readonly TicketBaiWsSpfeStatusRecord[]>(
      'GET',
      'spfe-estados/',
      {
        query: {
          id: filters.id,
          serie: filters.serie,
          numero: filters.numero,
          factura: filters.factura,
          nif_emisor: filters.nif_emisor,
        },
      },
    );
  }
}

export default TicketBaiWsSpfeStatusesResource;
