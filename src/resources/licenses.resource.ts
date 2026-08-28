import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsCreateLicenseRequest,
  TicketBaiWsCreateLicenseResponse,
  TicketBaiWsCreateLicenseResult,
  TicketBaiWsLicense,
  TicketBaiWsListLicensesRequest,
  TicketBaiWsListLicensesResponse,
} from '../model/license/ticketbaiws-license.model.js';

class TicketBaiWsLicensesResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Creates one or more TicketBaiWS licenses.
   *
   * @param license License plan, quantity, duration and billing modality.
   * @returns The response containing the created license identifiers.
   */
  async create(
    license: TicketBaiWsCreateLicenseRequest,
  ): Promise<TicketBaiWsCreateLicenseResponse> {
    return this.httpClient.request<TicketBaiWsCreateLicenseResult>(
      'POST',
      'licencias/',
      {
        json: license,
      },
    );
  }

  /**
   * Lists TicketBaiWS licenses associated with the current account.
   *
   * @param filters Optional filters used to query a specific license.
   * @returns The license list response.
   */
  async list(
    filters: TicketBaiWsListLicensesRequest = {},
  ): Promise<TicketBaiWsListLicensesResponse> {
    return this.httpClient.request<readonly TicketBaiWsLicense[]>(
      'GET',
      'licencias/',
      {
        query: {
          id_licencia: filters.id_licencia,
        },
      },
    );
  }
}

export default TicketBaiWsLicensesResource;
