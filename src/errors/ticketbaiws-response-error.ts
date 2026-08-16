import TicketBaiWsError from './ticketbaiws-error.js';

class TicketBaiWsResponseError extends TicketBaiWsError {
  readonly responseBody: string;

  constructor(message: string, responseBody: string, options?: ErrorOptions) {
    super(message, options);

    this.responseBody = responseBody;
  }
}

export default TicketBaiWsResponseError;
