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

  /**
   * Validates a Spanish tax identifier against the AEAT census.
   *
   * For natural persons, the name may be required by TicketBaiWS to
   * perform the identification.
   *
   * @param data Tax identifier and optional name to validate.
   * @returns The AEAT validation response.
   */
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

  /**
   * Validates a VAT identification number against the VIES service.
   *
   * @param data Tax identifier and country code to validate.
   * @returns The VIES validation response.
   */
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
