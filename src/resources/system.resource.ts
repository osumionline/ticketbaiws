import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type TicketBaiWsStatusResponse from '../model/system/ticketbaiws-status-response.model.js';

class TicketBaiWsSystemResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  async status(): Promise<TicketBaiWsStatusResponse> {
    return this.httpClient.request<readonly unknown[]>('GET', 'status/');
  }
}

export default TicketBaiWsSystemResource;
