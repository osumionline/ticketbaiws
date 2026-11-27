import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsBillingCustomer,
  TicketBaiWsBillingCustomerResponse,
  TicketBaiWsCreateBillingCustomerRequest,
  TicketBaiWsListBillingCustomersRequest,
  TicketBaiWsListBillingCustomersResponse,
  TicketBaiWsUpdateBillingCustomerRequest,
} from '../model/billing/ticketbaiws-billing-customer.model.js';

class TicketBaiWsBillingCustomersResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Searches customers stored in the TicketBaiWS invoicing tool.
   *
   * Customer records are shared between the test and production
   * environments. The result is paginated, starting at page zero.
   *
   * @param filters Optional search and pagination parameters.
   * @returns The customer list and available pagination metadata.
   */
  async list(
    filters: TicketBaiWsListBillingCustomersRequest = {},
  ): Promise<TicketBaiWsListBillingCustomersResponse> {
    return this.httpClient.request<readonly TicketBaiWsBillingCustomer[]>(
      'GET',
      'clientes/',
      {
        query: {
          buscar: filters.buscar,
          nif: filters.nif,
          pagina: filters.pagina,
          cantidad: filters.cantidad,
        },
      },
    );
  }

  /**
   * Gets an invoicing customer by its numeric identifier.
   *
   * @param id Customer identifier.
   * @returns The customer record.
   */
  async get(id: number): Promise<TicketBaiWsBillingCustomerResponse> {
    return this.httpClient.request<TicketBaiWsBillingCustomer>(
      'GET',
      `clientes/${encodeURIComponent(String(id))}/`,
    );
  }

  /**
   * Creates a customer in the TicketBaiWS invoicing tool.
   *
   * Customer records are shared between test and production.
   * Duplicate identifiers or names may be rejected by the API.
   *
   * @param customer Customer information to create.
   * @returns The created customer record.
   */
  async create(
    customer: TicketBaiWsCreateBillingCustomerRequest,
  ): Promise<TicketBaiWsBillingCustomerResponse> {
    return this.httpClient.request<TicketBaiWsBillingCustomer>(
      'POST',
      'clientes/',
      {
        json: customer,
      },
    );
  }

  /**
   * Partially updates an invoicing customer.
   *
   * Only fields included in the request are modified.
   * Changes affect the shared customer records used by both
   * API environments.
   *
   * @param id Customer identifier.
   * @param customer Fields to update.
   * @returns The updated customer record.
   */
  async update(
    id: number,
    customer: TicketBaiWsUpdateBillingCustomerRequest,
  ): Promise<TicketBaiWsBillingCustomerResponse> {
    return this.httpClient.request<TicketBaiWsBillingCustomer>(
      'PUT',
      `clientes/${encodeURIComponent(String(id))}/`,
      {
        json: customer,
      },
    );
  }
}

export default TicketBaiWsBillingCustomersResource;
