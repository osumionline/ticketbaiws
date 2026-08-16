import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type TicketBaiWsCompleteInvoiceRequest from '../model/invoice/ticketbaiws-complete-invoice-request.model.js';
import type { TicketBaiWsCompleteInvoiceResponse } from '../model/invoice/ticketbaiws-complete-invoice-response.model.js';
import type TicketBaiWsCreateInvoiceRequest from '../model/invoice/ticketbaiws-create-invoice-request.model.js';
import type {
  TicketBaiWsCreateInvoiceResponse,
  TicketBaiWsCreateInvoiceResult,
  TicketBaiWsTicketBaiInvoiceResult,
} from '../model/invoice/ticketbaiws-create-invoice-response.model.js';
import type {
  TicketBaiWsGetInvoiceResponse,
  TicketBaiWsGetInvoiceResult,
} from '../model/invoice/ticketbaiws-get-invoice-response.model.js';
import type {
  TicketBaiWsCancelInvoiceResponse,
  TicketBaiWsInvoiceActionResult,
  TicketBaiWsResendInvoiceResponse,
} from '../model/invoice/ticketbaiws-invoice-action-response.model.js';
import type {
  TicketBaiWsCancelInvoiceRequest,
  TicketBaiWsInvoiceReference,
} from '../model/invoice/ticketbaiws-invoice-reference.model.js';

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

  async completeSimplified(
    invoice: TicketBaiWsCompleteInvoiceRequest,
  ): Promise<TicketBaiWsCompleteInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsTicketBaiInvoiceResult>(
      'POST',
      'tbai-completar/',
      {
        json: invoice,
      },
    );
  }

  async get(
    invoice: TicketBaiWsInvoiceReference,
  ): Promise<TicketBaiWsGetInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsGetInvoiceResult>(
      'GET',
      'tbai/',
      {
        query: {
          serie: invoice.serie,
          numero: invoice.numero,
        },
      },
    );
  }

  async cancel(
    invoice: TicketBaiWsCancelInvoiceRequest,
  ): Promise<TicketBaiWsCancelInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsInvoiceActionResult>(
      'DELETE',
      'tbai/',
      {
        json: invoice,
      },
    );
  }

  async resend(
    invoice: TicketBaiWsInvoiceReference,
  ): Promise<TicketBaiWsResendInvoiceResponse> {
    return this.httpClient.request<TicketBaiWsInvoiceActionResult>(
      'PUT',
      'reset-tbai/',
      {
        json: invoice,
      },
    );
  }
}

export default TicketBaiWsInvoicesResource;
