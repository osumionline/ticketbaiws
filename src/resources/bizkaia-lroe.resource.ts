import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsBizkaiaLroeCashCollectionsResource from './bizkaia-lroe-cash-collections.resource.js';
import TicketBaiWsBizkaiaLroeCashPaymentsResource from './bizkaia-lroe-cash-payments.resource.js';
import TicketBaiWsBizkaiaLroeExpensesWithoutInvoiceResource from './bizkaia-lroe-expenses-without-invoice.resource.js';
import TicketBaiWsBizkaiaLroeReceivedInvoicesResource from './bizkaia-lroe-received-invoices.resource.js';

class TicketBaiWsBizkaiaLroeResource {
  readonly cashCollections: TicketBaiWsBizkaiaLroeCashCollectionsResource;
  readonly cashPayments: TicketBaiWsBizkaiaLroeCashPaymentsResource;
  readonly expensesWithoutInvoice: TicketBaiWsBizkaiaLroeExpensesWithoutInvoiceResource;
  readonly receivedInvoices: TicketBaiWsBizkaiaLroeReceivedInvoicesResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.cashCollections = new TicketBaiWsBizkaiaLroeCashCollectionsResource(
      httpClient,
    );

    this.cashPayments = new TicketBaiWsBizkaiaLroeCashPaymentsResource(
      httpClient,
    );

    this.expensesWithoutInvoice =
      new TicketBaiWsBizkaiaLroeExpensesWithoutInvoiceResource(httpClient);

    this.receivedInvoices = new TicketBaiWsBizkaiaLroeReceivedInvoicesResource(
      httpClient,
    );
  }
}

export default TicketBaiWsBizkaiaLroeResource;
