import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type TicketBaiWsCreateInvoiceRequest from '../model/invoice/ticketbaiws-create-invoice-request.model.js';
import type {
  TicketBaiWsCreateInvoiceResponse,
  TicketBaiWsCreateInvoiceResult,
} from '../model/invoice/ticketbaiws-create-invoice-response.model.js';

class TicketBaiWsInvoicesResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  async create(
    invoice: TicketBaiWsCreateInvoiceRequest,
  ): Promise<TicketBaiWsCreateInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsCreateInvoiceResult>(
      'POST',
      'tbai/',
      {
        json: invoice,
      },
    );
  }
}

export default TicketBaiWsInvoicesResource;
