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

  async create(
    company: TicketBaiWsCreateCompanyRequest,
  ): Promise<TicketBaiWsCompanyResponse> {
    return this.httpClient.request<TicketBaiWsCompany>('POST', 'empresas/', {
      json: company,
    });
  }

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
