import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import TicketBaiWsVerifactuRepresentationResource from './verifactu-representation.resource.js';

class TicketBaiWsVerifactuResource {
  readonly representation: TicketBaiWsVerifactuRepresentationResource;

  constructor(httpClient: TicketBaiWsHttpClient) {
    this.representation = new TicketBaiWsVerifactuRepresentationResource(
      httpClient,
    );
  }
}

export default TicketBaiWsVerifactuResource;
