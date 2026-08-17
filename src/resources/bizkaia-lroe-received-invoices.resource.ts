import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsCreateLroeReceivedInvoicesRequest,
  TicketBaiWsLroeReceivedInvoicesMutationResponse,
  TicketBaiWsLroeReceivedInvoicesMutationResult,
  TicketBaiWsUpdateLroeReceivedInvoicesRequest,
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
}

export default TicketBaiWsBizkaiaLroeReceivedInvoicesResource;
