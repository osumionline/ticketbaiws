import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsEpigraph,
  TicketBaiWsListEpigraphsResponse,
} from '../model/bizkaia/ticketbaiws-epigraph.model.js';

class TicketBaiWsBizkaiaEpigraphsResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Lists the IAE epigraphs available for BATUZ/LROE Bizkaia.
   *
   * @returns The TicketBaiWS epigraph list response.
   */
  async list(): Promise<TicketBaiWsListEpigraphsResponse> {
    return this.httpClient.request<readonly TicketBaiWsEpigraph[]>(
      'GET',
      'epigrafes/',
    );
  }
}

export default TicketBaiWsBizkaiaEpigraphsResource;
