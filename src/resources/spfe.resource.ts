import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsSpfeReceivedInvoicesResource from './spfe-received-invoices.resource.js';
import TicketBaiWsSpfeStatusesResource from './spfe-statuses.resource.js';

class TicketBaiWsSpfeResource {
  readonly receivedInvoices: TicketBaiWsSpfeReceivedInvoicesResource;
  readonly statuses: TicketBaiWsSpfeStatusesResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.receivedInvoices = new TicketBaiWsSpfeReceivedInvoicesResource(
      httpClient,
    );

    this.statuses = new TicketBaiWsSpfeStatusesResource(httpClient);
  }
}

export default TicketBaiWsSpfeResource;
