import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsBillingProduct,
  TicketBaiWsBillingProductResponse,
  TicketBaiWsListBillingProductsRequest,
  TicketBaiWsListBillingProductsResponse,
} from '../model/billing/ticketbaiws-billing-product.model.js';

class TicketBaiWsBillingProductsResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Searches products stored in the TicketBaiWS invoicing tool.
   *
   * Product records are shared between test and production.
   * Searches can filter by text, exact reference or family.
   *
   * Pagination starts at page zero.
   *
   * @param filters Optional search and pagination parameters.
   * @returns The product list and pagination metadata.
   */
  async list(
    filters: TicketBaiWsListBillingProductsRequest = {},
  ): Promise<TicketBaiWsListBillingProductsResponse> {
    return this.httpClient.request<readonly TicketBaiWsBillingProduct[]>(
      'GET',
      'productos/',
      {
        query: {
          buscar: filters.buscar,
          referencia: filters.referencia,
          familia: filters.familia,
          pagina: filters.pagina,
          cantidad: filters.cantidad,
        },
      },
    );
  }

  /**
   * Gets an invoicing product by its code.
   *
   * The code is treated as a string to preserve its exact
   * representation, including leading zeros.
   *
   * @param code Product code returned by the list endpoint.
   * @returns The product record.
   */
  async get(code: string): Promise<TicketBaiWsBillingProductResponse> {
    return this.httpClient.request<TicketBaiWsBillingProduct>(
      'GET',
      `productos/${encodeURIComponent(code)}/`,
    );
  }
}

export default TicketBaiWsBillingProductsResource;
