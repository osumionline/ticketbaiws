import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsBizkaiaLroeReceivedInvoicesResource from './bizkaia-lroe-received-invoices.resource.js';

class TicketBaiWsBizkaiaLroeResource {
  readonly receivedInvoices: TicketBaiWsBizkaiaLroeReceivedInvoicesResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.receivedInvoices = new TicketBaiWsBizkaiaLroeReceivedInvoicesResource(
      httpClient,
    );
  }
}

export default TicketBaiWsBizkaiaLroeResource;
