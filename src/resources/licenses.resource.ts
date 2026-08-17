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
