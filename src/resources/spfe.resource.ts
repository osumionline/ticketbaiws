import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsSpfeStatusesResource from './spfe-statuses.resource.js';

class TicketBaiWsSpfeResource {
  readonly statuses: TicketBaiWsSpfeStatusesResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.statuses = new TicketBaiWsSpfeStatusesResource(httpClient);
  }
}

export default TicketBaiWsSpfeResource;
