import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsBizkaiaLroeCashCollectionsResource from './bizkaia-lroe-cash-collections.resource.js';
import TicketBaiWsBizkaiaLroeReceivedInvoicesResource from './bizkaia-lroe-received-invoices.resource.js';

class TicketBaiWsBizkaiaLroeResource {
  readonly cashCollections: TicketBaiWsBizkaiaLroeCashCollectionsResource;
  readonly receivedInvoices: TicketBaiWsBizkaiaLroeReceivedInvoicesResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.cashCollections = new TicketBaiWsBizkaiaLroeCashCollectionsResource(
      httpClient,
    );

    this.receivedInvoices = new TicketBaiWsBizkaiaLroeReceivedInvoicesResource(
      httpClient,
    );
  }
}

export default TicketBaiWsBizkaiaLroeResource;
