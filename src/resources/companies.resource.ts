import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsCompany,
  TicketBaiWsCompanyResponse,
  TicketBaiWsCreateCompanyRequest,
  TicketBaiWsListCompaniesRequest,
  TicketBaiWsListCompaniesResponse,
  TicketBaiWsUpdateCompanyRequest,
} from '../model/company/ticketbaiws-company.model.js';

class TicketBaiWsCompaniesResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Creates a company in TicketBaiWS.
   *
   * @param company Company data to register.
   * @returns The created company response.
   */
  async create(
    company: TicketBaiWsCreateCompanyRequest,
  ): Promise<TicketBaiWsCompanyResponse> {
    return this.httpClient.request<TicketBaiWsCompany>('POST', 'empresas/', {
      json: company,
    });
  }

  /**
   * Updates an existing company.
   *
   * Only the fields included in the request are modified.
   *
   * @param nif Tax identifier of the company to update.
   * @param company Company fields to modify.
   * @returns The updated company response.
   */
  async update(
    nif: string,
    company: TicketBaiWsUpdateCompanyRequest,
  ): Promise<TicketBaiWsCompanyResponse> {
    return this.httpClient.request<TicketBaiWsCompany>(
      'PUT',
      `empresas/${encodeURIComponent(nif)}/`,
      {
        json: company,
      },
    );
  }

  /**
   * Lists companies available to the current TicketBaiWS account.
   *
   * @param filters Optional filters such as license ID or tax identifier.
   * @returns The company list response.
   */
  async list(
    filters: TicketBaiWsListCompaniesRequest = {},
  ): Promise<TicketBaiWsListCompaniesResponse> {
    return this.httpClient.request<readonly TicketBaiWsCompany[]>(
      'GET',
      'empresas/',
      {
        query: {
          id_licencia: filters.id_licencia,
          nif: filters.nif,
        },
      },
    );
  }
}

export default TicketBaiWsCompaniesResource;
