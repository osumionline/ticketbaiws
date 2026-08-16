import type { TicketBaiWsErrorResponse } from '../model/common/ticketbaiws-response.model.js';
import TicketBaiWsError from './ticketbaiws-error.js';

class TicketBaiWsApiError extends TicketBaiWsError {
  readonly apiResponse: TicketBaiWsErrorResponse;

  constructor(apiResponse: TicketBaiWsErrorResponse) {
    const message: string =
      apiResponse.msg !== null && apiResponse.msg.trim() !== ''
        ? apiResponse.msg
        : 'TicketBaiWS API returned an error.';

    super(message);

    this.apiResponse = apiResponse;
  }
}

export default TicketBaiWsApiError;
