import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsBillingCustomersResource from './billing-customers.resource.js';
import TicketBaiWsBillingProductsResource from './billing-products.resource.js';

class TicketBaiWsBillingResource {
  readonly customers: TicketBaiWsBillingCustomersResource;
  readonly products: TicketBaiWsBillingProductsResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.customers = new TicketBaiWsBillingCustomersResource(httpClient);

    this.products = new TicketBaiWsBillingProductsResource(httpClient);
  }
}

export default TicketBaiWsBillingResource;
