import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsBillingCustomersResource from './billing-customers.resource.js';

class TicketBaiWsBillingResource {
  readonly customers: TicketBaiWsBillingCustomersResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.customers = new TicketBaiWsBillingCustomersResource(httpClient);
  }
}

export default TicketBaiWsBillingResource;
