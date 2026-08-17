import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsBizkaiaEpigraphsResource from './bizkaia-epigraphs.resource.js';

class TicketBaiWsBizkaiaResource {
  readonly epigraphs: TicketBaiWsBizkaiaEpigraphsResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.epigraphs = new TicketBaiWsBizkaiaEpigraphsResource(httpClient);
  }
}

export default TicketBaiWsBizkaiaResource;
