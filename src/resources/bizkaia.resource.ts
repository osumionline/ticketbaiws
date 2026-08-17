import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsBizkaiaEpigraphsResource from './bizkaia-epigraphs.resource.js';
import TicketBaiWsBizkaiaLroeResource from './bizkaia-lroe.resource.js';

class TicketBaiWsBizkaiaResource {
  readonly epigraphs: TicketBaiWsBizkaiaEpigraphsResource;

  readonly lroe: TicketBaiWsBizkaiaLroeResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.epigraphs = new TicketBaiWsBizkaiaEpigraphsResource(httpClient);

    this.lroe = new TicketBaiWsBizkaiaLroeResource(httpClient);
  }
}

export default TicketBaiWsBizkaiaResource;
