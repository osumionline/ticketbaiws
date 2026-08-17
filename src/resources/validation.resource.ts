import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsAeatValidationRequest,
  TicketBaiWsAeatValidationResponse,
  TicketBaiWsAeatValidationResult,
  TicketBaiWsViesValidationRequest,
  TicketBaiWsViesValidationResponse,
  TicketBaiWsViesValidationResult,
} from '../model/validation/ticketbaiws-validation.model.js';

class TicketBaiWsValidationResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  async aeat(
    data: TicketBaiWsAeatValidationRequest,
  ): Promise<TicketBaiWsAeatValidationResponse> {
    return this.httpClient.request<TicketBaiWsAeatValidationResult>(
      'POST',
      'validar-nif/',
      {
        json: data,
      },
    );
  }

  async vies(
    data: TicketBaiWsViesValidationRequest,
  ): Promise<TicketBaiWsViesValidationResponse> {
    return this.httpClient.request<TicketBaiWsViesValidationResult>(
      'POST',
      'validar-nif-vies/',
      {
        json: data,
      },
    );
  }
}

export default TicketBaiWsValidationResource;
