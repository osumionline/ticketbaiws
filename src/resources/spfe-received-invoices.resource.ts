import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsListSpfeReceivedInvoicesRequest,
  TicketBaiWsListSpfeReceivedInvoicesResponse,
  TicketBaiWsSpfeReceivedInvoice,
} from '../model/spfe/ticketbaiws-spfe-received-invoice.model.js';

class TicketBaiWsSpfeReceivedInvoicesResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Lists invoices received from suppliers through the AEAT SPFE.
   *
   * TicketBaiWS synchronizes received invoices from the AEAT
   * periodically. The company must have SPFE enabled and
   * the necessary authorization to query its invoices.
   *
   * When desde_id is provided, only invoices with a greater
   * ID are returned, ordered by ascending ID.
   *
   * When ubl is true, each invoice may include its original
   * UBL XML document.
   *
   * The caller must inspect the response msg field because
   * TicketBaiWS can return an empty list with an authorization
   * warning even when result is OK.
   *
   * @param filters Optional filters for the received invoices.
   * @returns The TicketBaiWS response containing received invoices.
   */
  async list(
    filters: TicketBaiWsListSpfeReceivedInvoicesRequest = {},
  ): Promise<TicketBaiWsListSpfeReceivedInvoicesResponse> {
    return this.httpClient.request<readonly TicketBaiWsSpfeReceivedInvoice[]>(
      'GET',
      'spfe-recibidas/',
      {
        query: {
          desde_id: filters.desde_id,
          id: filters.id,
          estado: filters.estado,
          nif_emisor: filters.nif_emisor,
          factura: filters.factura,
          desde: filters.desde,
          hasta: filters.hasta,
          limite: filters.limite,
          ubl: filters.ubl,
        },
      },
    );
  }
}

export default TicketBaiWsSpfeReceivedInvoicesResource;
