import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type TicketBaiWsStatusResponse from '../model/system/ticketbaiws-status-response.model.js';

class TicketBaiWsSystemResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  /**
   * Gets the current status of the TicketBaiWS service.
   *
   * @returns The TicketBaiWS service status response.
   */
  async status(): Promise<TicketBaiWsStatusResponse> {
    return this.httpClient.request<readonly unknown[]>('GET', 'status/');
  }
}

export default TicketBaiWsSystemResource;
